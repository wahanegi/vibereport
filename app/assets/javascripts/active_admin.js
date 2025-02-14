//= require active_admin/base
//= require Chart.bundle
//= require chartkick

function showMore(event, elementId, visibleBubbles) {
    const element = document.getElementById(elementId);
    const list = element.children
    const button = event.target;

    if (button.textContent === 'More') {
        // Show items
        changeVisibility(list, visibleBubbles, false);
        button.textContent = 'Less';
    } else {
        // Hide items
        changeVisibility(list, visibleBubbles, true);
        button.textContent = 'More';
    }
}

function changeVisibility(list, visibleBubbles, hideElement) {
    for (let index = 0; index < list.length; index++) {
        const item = list[index];
        const classes = item.classList;

        if (index >= visibleBubbles) {
            hideElement ? classes.add('display-none') : classes.remove('display-none');
        }
    }
}