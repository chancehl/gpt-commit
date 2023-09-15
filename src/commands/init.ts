type InitOptions = {
    force: boolean
}

export function init(options: Partial<InitOptions>) {
    options = { ...options, force: options.force ?? false }

    console.log('init', { options })
}
