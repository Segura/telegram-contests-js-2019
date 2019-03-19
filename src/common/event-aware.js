export class EventAware {

    constructor(container) {
        this.container = container
    }

    static subscribeTo(element, eventName, handler) {
        element.addEventListener(eventName, handler, false)
    }

    static notifyTo(element, eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail,
            bubbles: true,
            cancelable: true
        })

        element.dispatchEvent(event)
    }

    subscribe(eventName, handler) {
        EventAware.subscribeTo(this.container, eventName, handler)
    }

    notify(eventName, detail = {}) {
        EventAware.notifyTo(this.container, eventName, detail)
    }
}
