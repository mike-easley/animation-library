const { fromEvent, range, animationFrameScheduler } = rxjs;
const { filter, find, map, tap, mergeMap, switchMap } = rxjs.operators;

const elements = document.getElementsByTagName("img");
const scrollObservable$ = fromEvent(window, "scroll");
const scrollHeight$ = scrollObservable$.pipe(
  map(event => {
    return (
      event.target.documentElement.scrollTop || event.target.body.scrollTop
    );
  })
);

function getOffsetTopObservable(element) {
  const filterVal = element.offsetTop;
  return scrollHeight$.pipe(
    find(height => height >= filterVal),
    mergeMap(el => {
      const limit = 100;
      return range(1, limit, animationFrameScheduler).pipe(
        tap(opacityNumber => {
          element.style.opacity = opacityNumber / limit;
          element.style.width = `${(opacityNumber / limit) * 100}%`;
          console.log(element.style);
        })
      );
    })
  );
}

const arrayOfObs = [...elements].map(getOffsetTopObservable);
arrayOfObs.forEach((obs, idx) => obs.subscribe(val => console.log(idx, val)));
