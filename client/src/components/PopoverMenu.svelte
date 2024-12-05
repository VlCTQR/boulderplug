<script>
    export let isVisible = false;
    export let onClose = () => {};
    export let top = '1.5%';
    export let left = '3.5%';
</script>

<div class={`overlay ${isVisible ? 'show' : ''}`} on:click="{onClose}" on:keydown="{onClose}">
    <div class={`popover ${isVisible ? 'show' : ''}`} on:click|stopPropagation on:keydown|stopPropagation style="top: {top}; left: {left};">
        <slot></slot>
        <button class="close-btn" on:click="{onClose}" on:keydown="{onClose}">
            Close
        </button>
    </div>
</div>

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        z-index: 1000;
    }

    .popover {
        background: var(--background-color);
        padding: 1rem;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        position: absolute;
        transform: translateY(10px);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .close-btn {
        display: block;
        margin: 1rem auto 0;
    }

    .close-btn:hover {
        background-color: var(--disabled-color);
        border-color: var(--disabled-color);
    }
</style>
