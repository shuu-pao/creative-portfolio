export async function resolve(specifier, context, next) {
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\.(js|json|mjs|cjs)$/.test(specifier)) {
    try {
      return await next(specifier + '.js', context)
    } catch {
      return next(specifier, context)
    }
  }
  return next(specifier, context)
}
