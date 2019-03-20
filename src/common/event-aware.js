const DEBOUNCE = 1000 / 24

export class EventAware {

    constructor(container) {
        this.container = container
        this.debounces = {}
        this.events = {}

        this.sendEvent = this.sendEvent.bind(this)
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

    sendEvent(eventName) {
        if (this.events[eventName]) {
            EventAware.notifyTo(this.container, eventName, this.events[eventName])
            this.events[eventName] = null
            this.debounces[eventName] = setTimeout(() => this.sendEvent(eventName), DEBOUNCE)
        } else {
            this.debounces[eventName] = null
        }
    }

    notify(eventName, detail = {}) {
        if (this.debounces[eventName]) {
            this.events[eventName] = detail
        } else {
            EventAware.notifyTo(this.container, eventName, detail)
            this.debounces[eventName] = setTimeout(() => this.sendEvent(eventName), DEBOUNCE)
        }
    }
}
