//= require active_admin/base
//= require Chart.bundle
//= require chartkick

function showMore(event, elementId, visibleBubbles) {
    const element = document.getElementById(elementId);

    if (event.target.textContent === 'More') {
        // Show items
        changeVisibility(element.children, 'bubble', visibleBubbles);
        event.target.textContent = 'Less';
    } else {
        // Hide items
        changeVisibility(element.children,'bubble display-none', visibleBubbles);
        event.target.textContent = 'More';
    }
}

function changeVisibility(list, className, visibleBubbles) {
    for (let index = 0; index < list.length; index++) {
        const item = list[index];

        if (index >= visibleBubbles) {
            item.className = className;
        }
    }
}