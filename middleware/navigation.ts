import { generateDynamicPath, slugToTitle } from "~/utils/router"

export default defineNuxtRouteMiddleware((to, from) => {
    const breadCrumbInfo = to.matched.flatMap((el) => {

        const value = el.meta.breadCrumb
        // path '/forum' matched is excluded (doesn't have pageMeta) becasuse
        // we are using the parent path to includ in navigation
        if (value === undefined) return []

        if (value.isDynamic) {
            const pathTemplate = el.path
            const path = generateDynamicPath(pathTemplate, to.params)
            const slug = path[1]
            value.to = path[0]
            value.label = slugToTitle(slug)
        }

        return value === undefined ? [] : value
    })

    const links = useState('navigation')
    links.value = breadCrumbInfo
})
