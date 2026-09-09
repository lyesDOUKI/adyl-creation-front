import { useAuth } from '@/ui/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
    LogIn,
    UserPlus,
    LogOut,
    User,
    Loader2,
    ChevronDown
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';

export function AuthButtons() {
    const {
        isAuthenticated,
        isLoading,
        user,
        login,
        register,
        logout,
    } = useAuth();

    const [isHovered, setIsHovered] = useState(false);

    // Fonction pour obtenir les initiales de l'utilisateur
    const getUserInitials = () => {
        if (!user) return '?';
        if (user.firstName) return user.firstName[0].toUpperCase();
        if (user.email) return user.email[0].toUpperCase();
        return '?';
    };

    // Fonction pour obtenir le nom d'affichage
    const getDisplayName = () => {
        if (!user) return 'Utilisateur';
        if (user.firstName) return user.firstName;
        if (user.email) return user.email.split('@')[0];
        return 'Utilisateur';
    };

    if (isLoading) {
        return (
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full gap-2"
                    disabled
                >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Chargement...</span>
                </Button>
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <div className="flex items-center gap-2 transition-all duration-200">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative h-9 rounded-full px-3 gap-2 hover:bg-muted/60 transition-all duration-200 group"
                        >
                            <Avatar className="h-7 w-7 border-2 border-primary/20 transition-colors group-hover:border-primary/40">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                    {getUserInitials()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="hidden md:inline text-sm font-medium max-w-[120px] truncate">
                                {getDisplayName()}
                            </span>
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 mt-1 shadow-lg border-muted/20"
                    >
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {user?.firstName || getDisplayName()}
                                </p>
                                {user?.email && (
                                    <p className="text-xs leading-none text-muted-foreground truncate">
                                        {user.email}
                                    </p>
                                )}
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                            onClick={logout}
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Déconnexion</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Version mobile simplifiée */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-9 w-9 rounded-full hover:bg-muted/60 transition-all duration-200"
                    onClick={logout}
                    aria-label="Déconnexion"
                >
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 transition-all duration-200">
            {/* Version desktop */}
            <div className="hidden sm:flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full gap-2 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary shadow-sm hover:shadow-md"
                    onClick={login}
                >
                    <LogIn className="h-3.5 w-3.5" />
                    <span>Se connecter</span>
                </Button>

                <Button
                    size="sm"
                    className="rounded-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                    onClick={register}
                >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span className="hidden lg:inline">Créer un compte</span>
                    <span className="lg:hidden">S'inscrire</span>
                </Button>
            </div>

            {/* Version mobile */}
            <div className="flex sm:hidden items-center gap-1.5">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-muted/60 transition-all duration-200"
                    onClick={login}
                    aria-label="Se connecter"
                >
                    <LogIn className="h-4 w-4" />
                </Button>

                <Button
                    size="icon"
                    className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm active:scale-[0.98]"
                    onClick={register}
                    aria-label="S'inscrire"
                >
                    <UserPlus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}