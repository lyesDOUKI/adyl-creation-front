export interface HalLink {
    href: string;
}

export type HalResource<T, Rel extends string = string> = T & {
    _links?: Partial<Record<Rel, HalLink>>;
};

export function hasLink<Rel extends string>(
    resource: HalResource<unknown, Rel>,
    rel: Rel,
): boolean {
    return resource._links?.[rel] !== undefined;
}

export function getLink<Rel extends string>(
    resource: HalResource<unknown, Rel>,
    rel: Rel,
): HalLink {
    const link = resource._links?.[rel];
    if (!link) throw new Error(`Lien HAL absent : ${rel}`);
    return link;
}

export async function follow<T = void>(
    link: HalLink,
    init: RequestInit = {},
): Promise<T> {
    const res = await fetch(link.href, {
        credentials: 'include',
        ...init,
        headers: { Accept: 'application/hal+json', ...init.headers },
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.status === 204 ? (undefined as T) : res.json();
}