export const createContainer = (parent, className = null) => {
    const container = document.createElement('div')
    container.classList.add(className)
    parent.appendChild(container)
    return container
}

export const formatValue = (value, config = {}) => {
    if (value) {
        return new Intl.DateTimeFormat(config.locale, config.options).format(new Date(value))
    }
    return ''
}
