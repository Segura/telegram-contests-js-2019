export const draw = (container, loadDataPromise, config = {}) => {
    loadDataPromise.then((data) => {
        console.log(data)
    })
}
