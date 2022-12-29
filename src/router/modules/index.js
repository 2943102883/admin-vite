const modules = import.meta.globEager('./**/*.js')
import { sortBy } from 'lodash-es'
const routers = []

Object.keys(modules).forEach(route => {
  routers.push(modules[route].default)
})

let routersSort = sortBy(routers, function (item) {
  return item.meta.order
})

export const routes = routersSort
