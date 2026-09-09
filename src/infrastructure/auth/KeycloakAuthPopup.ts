const AUTH_CALLBACK_PATH = '/auth-popup-callback.html';

const POPUP_WIDTH = 500;
const POPUP_HEIGHT = 750;

export class KeycloakAuthPopup {

    getCallbackUrl(): string {
        return `${window.location.origin}${AUTH_CALLBACK_PATH}`;
    }

    async open(url: string): Promise<void> {
        const popup = this.openPopup(url);

        await this.waitForAuthentication(popup);
    }

    private openPopup(url: string): Window {
        const left = Math.max(
            0,
            window.screenX + (window.outerWidth - POPUP_WIDTH) / 2,
        );

        const top = Math.max(
            0,
            window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2,
        );

        const features = [
            `width=${POPUP_WIDTH}`,
            `height=${POPUP_HEIGHT}`,
            `left=${left}`,
            `top=${top}`,
            'resizable=yes',
            'scrollbars=yes',
        ].join(',');

        const popup = window.open(
            url,
            'keycloak-authentication',
            features,
        );

        if (!popup) {
            throw new Error(
                'La fenêtre de connexion a été bloquée par le navigateur.',
            );
        }

        popup.focus();

        return popup;
    }

    private waitForAuthentication(popup: Window): Promise<void> {
        return new Promise((resolve, reject) => {
            let completed = false;

            const cleanup = () => {
                window.removeEventListener('message', onMessage);
                window.clearInterval(popupCheckInterval);
            };

            const succeed = () => {
                if (completed) {
                    return;
                }

                completed = true;
                cleanup();

                popup.close();

                window.location.reload();

                resolve();
            };

            const fail = (error: Error) => {
                if (completed) {
                    return;
                }

                completed = true;
                cleanup();

                reject(error);
            };

            const onMessage = (event: MessageEvent) => {
                if (event.origin !== window.location.origin) {
                    return;
                }

                if (event.source !== popup) {
                    return;
                }

                if (event.data?.type !== 'KEYCLOAK_AUTH_SUCCESS') {
                    return;
                }

                succeed();
            };

            const popupCheckInterval = window.setInterval(() => {
                if (popup.closed) {
                    fail(
                        new Error(
                            'La fenêtre d’authentification a été fermée.',
                        ),
                    );
                }
            }, 500);

            window.addEventListener('message', onMessage);
        });
    }
}