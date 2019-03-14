export const createContainer = (parent, className = null) => {
    const container = document.createElement('div')
    container.classList.add(className)
    parent.appendChild(container)
    return container
}
