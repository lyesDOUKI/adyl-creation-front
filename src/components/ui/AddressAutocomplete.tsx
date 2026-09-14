import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    useAddressAutocomplete,
    AddressSuggestion,
} from '@/ui/hooks/useAddressAutocomplete';

type Props = {
    id: string;
    value: string;
    onChangeText: (text: string) => void;
    onSelect: (suggestion: AddressSuggestion) => void;
    placeholder?: string;
    hasSelection: boolean;
};

export const AddressAutocomplete = ({
                                        id,
                                        value,
                                        onChangeText,
                                        onSelect,
                                        placeholder,
                                        hasSelection,
                                    }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const containerRef = useRef<HTMLDivElement>(null);

    const {
        suggestions,
        isLoading,
        error,
    } = useAddressAutocomplete(
        hasSelection ? '' : value,
    );

    useEffect(() => {
        setIsOpen(
            suggestions.length > 0 &&
            !hasSelection,
        );

        setHighlightedIndex(-1);
    }, [suggestions, hasSelection]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (suggestion: AddressSuggestion) => {
        onSelect(suggestion);
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        onChangeText(event.target.value);

        if (!hasSelection) {
            setIsOpen(true);
        }
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (!isOpen || suggestions.length === 0) {
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();

            setHighlightedIndex(index =>
                (index + 1) % suggestions.length,
            );

            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();

            setHighlightedIndex(index =>
                index <= 0
                    ? suggestions.length - 1
                    : index - 1,
            );

            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();

            if (highlightedIndex >= 0) {
                handleSelect(
                    suggestions[highlightedIndex],
                );
            }

            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            setIsOpen(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative"
        >
            <div className="relative">
                <MapPin
                    className="
            absolute left-3 top-1/2
            -translate-y-1/2
            h-4 w-4
            text-muted-foreground
          "
                />

                <Input
                    id={id}
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-autocomplete="list"
                    aria-controls={`${id}-listbox`}
                    autoComplete="off"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (
                            !hasSelection &&
                            suggestions.length > 0
                        ) {
                            setIsOpen(true);
                        }
                    }}
                    placeholder={placeholder}
                    className={`pl-10 pr-9 ${
                        hasSelection
                            ? 'border-primary/50'
                            : ''
                    }`}
                />

                {isLoading && (
                    <Loader2
                        className="
              absolute right-3 top-1/2
              -translate-y-1/2
              h-4 w-4
              animate-spin
              text-muted-foreground
            "
                    />
                )}
            </div>

            {isOpen && suggestions.length > 0 && (
                <ul
                    id={`${id}-listbox`}
                    role="listbox"
                    className="
            absolute z-50 mt-1
            w-full
            rounded-md border
            bg-popover
            shadow-md
            max-h-64
            overflow-auto
          "
                >
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion.label}
                            role="option"
                            aria-selected={
                                index === highlightedIndex
                            }
                            onMouseDown={event => {
                                // Évite le blur avant la sélection.
                                event.preventDefault();
                                handleSelect(suggestion);
                            }}
                            onMouseEnter={() =>
                                setHighlightedIndex(index)
                            }
                            className={`
                px-3 py-2
                text-sm
                cursor-pointer
                ${
                                index === highlightedIndex
                                    ? 'bg-primary/10'
                                    : ''
                            }
              `}
                        >
                            {suggestion.label}
                        </li>
                    ))}
                </ul>
            )}

            {error && (
                <p className="mt-1 text-xs text-destructive">
                    {error}
                </p>
            )}

            {!hasSelection &&
                value.trim().length >= 3 &&
                !isLoading &&
                suggestions.length === 0 &&
                !error && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        Aucune adresse trouvée. Vérifiez la saisie.
                    </p>
                )}

            {hasSelection && (
                <p className="mt-1 text-xs text-primary">
                    Adresse sélectionnée
                </p>
            )}
        </div>
    );
};