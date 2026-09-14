import { useCallback, useEffect, useState } from 'react';
import {useAsyncReadState} from "@/ui/hooks/core/use-async-read-state.ts";

export type AddressSuggestion = {
    label: string;
    housenumber?: string;
    street?: string;
    postcode: string;
    city: string;
    citycode: string;
    coordinates: [number, number];
    score: number;
};

interface GeoApiFeatureProperties {
    type: string;
    label: string;
    housenumber?: string;
    street?: string;
    postcode: string;
    city: string;
    citycode: string;
    score: number;
}

interface GeoApiFeature {
    properties: GeoApiFeatureProperties;
    geometry: {
        coordinates: [number, number];
    };
}

interface GeoApiResponse {
    features?: GeoApiFeature[];
}

const GEOCODE_URL = window.__ENV__.GEOCODE_API_URL;
const MIN_QUERY_LENGTH = 5;
const DEBOUNCE_MS = 250;
const EMPTY_SUGGESTIONS: AddressSuggestion[] = [];

async function fetchAddressSuggestions(query: string): Promise<AddressSuggestion[]> {
    const url = `${GEOCODE_URL}?q=${encodeURIComponent(query)}&limit=5&autocomplete=1`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Impossible de récupérer les suggestions d'adresse.");
    }

    const data = (await res.json()) as GeoApiResponse;

    return (data.features ?? [])
        .filter((feature) =>
            ['housenumber', 'street'].includes(feature.properties?.type)
        )
        .map((feature) => ({
            label: feature.properties.label,
            housenumber: feature.properties.housenumber,
            street: feature.properties.street,
            postcode: feature.properties.postcode,
            city: feature.properties.city,
            citycode: feature.properties.citycode,
            coordinates: feature.geometry.coordinates,
            score: feature.properties.score,
        }));
}

export function useAddressAutocomplete(query: string) {
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const trimmed = query.trim();

        if (trimmed.length < MIN_QUERY_LENGTH) {
            setDebouncedQuery('');
            return;
        }

        const timer = setTimeout(() => {
            setDebouncedQuery(trimmed);
        }, DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [query]);

    const fetchData = useCallback(async (): Promise<AddressSuggestion[]> => {
        if (!debouncedQuery) {
            return EMPTY_SUGGESTIONS;
        }

        return fetchAddressSuggestions(debouncedQuery);
    }, [debouncedQuery]);

    const {
        data: suggestions,
        isLoading,
        error,
    } = useAsyncReadState(fetchData, EMPTY_SUGGESTIONS);

    return { suggestions, isLoading, error };
}