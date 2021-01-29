import { concat, Observable } from 'rxjs'
import { skip, take, tap } from 'rxjs/operators'

export const tapOnce: typeof tap = (...args: any) => {
  return (source: Observable<any>) => concat(source.pipe(take(1), tap(...args)), source.pipe(skip(1)))
}
