export default function() {
  this.transition(
    this.includingInitialRender(),
    this.childOf('.tabs-header'),
    this.use('scrollLink'),
  );
}
