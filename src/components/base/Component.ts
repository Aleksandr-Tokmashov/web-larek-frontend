export abstract class Component<T> {
    constructor(protected readonly container: HTMLElement) {

    }

    render(data?: Partial<T>): HTMLElement { 
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}