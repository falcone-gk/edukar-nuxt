import { generateDynamicPath, slugToTitle } from "~/utils/router"

export default defineNuxtRouteMiddleware((to, from) => {
    const matchedRoutes = to.matched
    const breadCrumbInfo = matchedRoutes.flatMap((route, i) => {
        const navInfo = route.meta.breadCrumb
        if (!navInfo) return []

        const pathTemplate = route.path
        const path = generateDynamicPath(pathTemplate, to.params)

        if (navInfo.isDynamic) {
            const parameter = path.split('/').at(-1)
            const label = slugToTitle(parameter as string)
            navInfo.label = label
        }

        navInfo.to = path
        return navInfo
    })
    const links = useState('navigation')
    links.value = breadCrumbInfo
})
