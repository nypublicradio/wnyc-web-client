import moveOver from "./move-over";
import { stop} from "liquid-fire";

export default function() {
  stop(this.oldElement);
  return moveOver.call(this, 'x', -1).then(() => {
      window.$('.liquid-child').css('transform', 'initial');
  });
}
