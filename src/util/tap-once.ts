import { concat, Observable } from 'rxjs'
import { first, skip, tap } from 'rxjs/operators'

export const tapOnce: typeof tap = (...args: any) => {
  return (source: Observable<any>) => concat(source.pipe(first(), tap(...args)), source.pipe(skip(1)))
}
