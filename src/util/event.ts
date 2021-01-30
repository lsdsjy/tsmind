import { fromEvent, Observable } from 'rxjs'

export const mousedown$: Observable<MouseEvent> = fromEvent(document, 'mousedown') as any
export const mousemove$: Observable<MouseEvent> = fromEvent(document, 'mousemove') as any
export const mouseup$ = fromEvent(document, 'mouseup')
