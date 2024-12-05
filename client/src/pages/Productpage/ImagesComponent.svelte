<script>
    export let images = [];

    let currentImageIndex = 0;
</script>

<main>
    <div class="images-container">
        <!-- Thumbnails for each image -->
        <div class="thumbnails">
            {#each images as image, index}
                <img
                        src={image}
                        alt={`Image ${index + 1}`}
                        class:selected={index === currentImageIndex}
                        on:click={() => currentImageIndex = index}
                />
            {/each}
        </div>

        <!-- Current large image -->
        <div class="current-image">
            <img
                    src={images[currentImageIndex]}
                    alt={`Image ${currentImageIndex + 1}`}
            />
        </div>
    </div>
</main>

<style>
    .images-container {
        display: flex;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
    }

    .thumbnails {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .thumbnails img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border: 3px solid gray;
        border-radius: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .thumbnails img.selected {
        border-color: blue;
    }

    .current-image img {
        width: 500px;
        max-width: 100%;
        height: auto;
        border-radius: 2rem;
        object-fit: cover;
        transition: all 0.3s ease;
    }

    .thumbnails img:focus {
        outline: 2px solid blue;
    }

    @media (max-width: 1024px) {
        .current-image img {
            width: 400px;
        }

        .thumbnails img {
            width: 80px;
            height: 80px;
        }
    }

    @media (max-width: 768px) {
        .images-container {
            flex-direction: column;
            align-items: center;
        }

        .current-image img {
            width: 300px;
        }

        .thumbnails img {
            width: 60px;
            height: 60px;
        }
    }
</style>
