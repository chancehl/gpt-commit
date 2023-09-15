type ExecutionOptions = {
    gitmoji?: boolean
}

export function execute(options: Partial<ExecutionOptions>) {
    options = { ...options, gitmoji: options?.gitmoji ?? false }

    console.log('EXEC!', { options })
}
