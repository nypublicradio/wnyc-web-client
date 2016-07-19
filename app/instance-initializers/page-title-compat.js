export function titleToMeta(root = document.head) {
  let titleTag = root.querySelector('title');
  if (titleTag) {
    let title = titleTag.textContent;
    let metaTag = document.createElement('meta');
    metaTag.name = 'title-for-ember';
    metaTag.content = title;
    root.appendChild(metaTag);
    titleTag.parentElement.removeChild(titleTag);
  }

}
export function initialize(/* appInstance */) {
  titleToMeta();
}

export default {
  name: 'page-title-compat',
  initialize
};
