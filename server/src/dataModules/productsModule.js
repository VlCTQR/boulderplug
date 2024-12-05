const brands = [
    "Scarpa",
    "Mad Rock",
    "La Sportiva",
    "Ocun",
    "Black Diamond"
];

const levels = [
    "Beginner",
    "Intermediate",
    "Advanced"
];

const closing = [
    "Laces",
    "Velcro",
    "None"
];

const colors = [
    "red", // 0
    "blue", // 1
    "orange", // 2
    "green", // 3
    "yellow", // 4
    "black", // 5
    "white", // 6
];

const products = [
    {
        id: 1,
        name: 'Scarpa Instinct VSR',
        description: 'A more supple version of our award-winning Instinct VS...',
        brand: brands[0],
        level: levels[1],
        closing: closing[1],
        toepatch: true,
        colors: [colors[1]],
        images: ['https://us.scarpa.com/media/catalog/product/cache/839578d87078eb48b5787e3f31eca926/7/0/70015_000_1_ins_vsr_blk_azu_instinct_vsr_black_azure_1.jpg', 'https://us.scarpa.com/media/catalog/product/cache/839578d87078eb48b5787e3f31eca926/7/0/70015_000_1_01_ins_vsr_blk_azu_instinct_vsr_black_azure_1.jpg', 'https://us.scarpa.com/media/catalog/product/cache/839578d87078eb48b5787e3f31eca926/7/0/70015_000_1_02_ins_vsr_blk_azu_instinct_vsr_black_azure_1.jpg'],
        bids: [
            { bid: 140, userId: 2 },
            { bid: 135, userId: 1 }
        ],
        dateOfSale: new Date('2024-09-14T14:00:00Z')
    },
    {
        id: 2,
        name: 'Drone LV 2.0',
        description: 'The Mad Rock Drone 2.0 LV climbing shoes are the ultimate choice...',
        brand: brands[1],
        level: levels[1],
        closing: closing[1],
        toepatch: true,
        colors: [colors[2], colors[3]],
        images: ['https://www.madrock.eu/web/image/product.product/1131/image_1024/%5B107042%5D%20Drone%20LV%202.0%20%284%20US%20-%2035%2C5%20EU%29?unique=5781388', 'https://www.madrock.eu/web/image/product.image/94/image_1024/Drone%20LV%202.0%20-%20side?unique=ea6dbc0', 'https://www.madrock.eu/web/image/product.image/95/image_1024/Drone%20LV%202.0-%20bottom?unique=ea6dbc0'],
        bids: [
            { bid: 95, userId: 1 },
            { bid: 89.99, userId: 2 }
        ],
        dateOfSale: new Date('2024-10-30T18:00:00Z')
    },
    {
        id: 3,
        name: "La Sportiva Cobra Orange",
        description: "The Cobra from La Sportiva is a climbing shoe for use on both resin and rock, featuring a scratch- and laceless construction that slips on easily and envelops the foot well. The leather exterior is robust and the absence of seams and thickness brings maximum performance on the claw. The insole is set back from the toes for superior grip and sensitivity. The Vibram outsole offers excellent grip. Finally, a small aesthetic detail, PermaTan tanning guarantees good color stability.",
        brand: brands[2],
        level: levels[1],
        closing: closing[2],
        toepatch: true,
        colors: [colors[2], colors[5]],
        images: ["https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/74da5bf4eb24d3d207cf52add6001860958bb9e8_E22LASPCHA2214257_0.jpeg", "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/06b3bf97cd552eabfdf90a5eed74a60921865f4f_E22LASPCHA2214257_1.jpeg", "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/87c03ac8eea8bd7f2cee816448721d3fc544ec1f_E22LASPCHA2214257_4.jpeg"],
        bids: [],
        dateOfSale: new Date('2025-03-30T13:00:00Z')
    },
    {
        id: 4,
        name: "Ocun Bullit",
        description: "The Ocun Bullit men's model is a climbing shoe that offers good support and grip and is particularly effective indoors on resin.",
        brand: brands[3],
        level: levels[0],
        closing: closing[1],
        toepatch: true,
        colors: [colors[0], colors[1]],
        images: ["https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/730dba682f0b7c32beaa12d75d506ec33d6a2dff_E23OCUNCHA3373599_0.jpeg", "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/1b7275a17e01c05a057595a04c8e273edf9d6d3f_E23OCUNCHA3373599_2.jpeg", "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/2364f80038a8075f536fb65f68d166607700e632_E23OCUNCHA3373599_4.jpeg"],
        bids: [],
        dateOfSale: new Date('2025-01-14T11:00:00Z')
    },
    {
        id: 5,
        name: "Method Envy Green",
        description: "Black Diamond's Method Envy Green climbing shoe is particularly comfortable in edge or hook.",
        brand: brands[4],
        level: levels[0],
        closing: closing[1],
        toepatch: true,
        colors: [colors[3]],
        images: ["https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/37b0c3c9201b8b545d427f4cc5191046f04ecf04_E22BDIACHA2218712_0.jpeg", "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/f31ee7a5aeeacb7e6e824cc59559f6ea79be08bc_E22BDIACHA2218712_4.jpeg", "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/954eed292c7db7c146355dca8639ec6a30bfb45c_E22BDIACHA2218712_9.jpeg"],
        bids: [],
        dateOfSale: new Date('2024-11-20T18:00:00Z')
    },
    {
        id: 6,
        name: "Scarpa Drago Lv",
        description: "The Scarpa Drago LV White is a high-end, resoleable climbing shoe with an updated shape for improved support, a PCB tension system for power transfer, and a Vibram XS Grip 2 sole for exceptional grip.",
        brand: brands[0],
        level: levels[2],
        closing: closing[1],
        toepatch: true,
        colors: [colors[5], colors[6]],
        images: ["https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/683c278392556e01b352ddc3191ae7d4279a8678_E24SCARCHA4454599_0.jpeg", "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/1a45f8ac068fb2b7930590df9c8cb521010b07b2_E24SCARCHA4454599_1.jpeg", "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/5d9c8328fc57d7977d218ad1ad59d8949d21ecf5_E24SCARCHA4454599_7.jpeg"],
        bids: [],
        dateOfSale: new Date('2024-11-12T14:00:00Z')
    },
    {
        id: 7,
        name: "Drone CS Hv",
        description: "The Mad Rock Drone 2.0 CS Hv is a high-performance, comfortable climbing shoe, perfect for any rock climbing discipline, offering exceptional traction and support.",
        brand: brands[1],
        level: levels[2],
        closing: closing[1],
        toepatch: true,
        colors: [colors[1], colors[0], colors[6]],
        images: ["https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/088107e9a80d5a428f957e6840e5ca7cb51221ca_H24MADCCHA4415226_0.jpeg", "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/c6224729675cae078cd6efe7335bfcc20aa40b40_H24MADCCHA4415226_1.jpeg", "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/923fdd725adeb1f3cb17437c0bfb43c0ae6a91fe_H24MADCCHA4415226_7.jpeg"],
        bids: [],
        dateOfSale: new Date('2024-12-12T12:00:00Z')
    },
    {
        id: 8,
        name: "Origin Women's Maldive",
        description: "With a slightly asymmetrical shape and very little camber, the Scarpa Origin Women's is a climbing shoe that prioritizes comfort. It will therefore be perfect for a beginner climber, but could also please a more advanced climber looking for a low-tech shoe for long routes.",
        brand: brands[0],
        level: levels[0],
        closing: closing[1],
        toepatch: false,
        colors: [colors[1], colors[3]],
        images: ["https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/45d5fdd8260074a7b50e9c00b22718287c12163c_E22SCARCHA2216326_0.jpeg", "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/be28bf0c8ff42b95269bfb33aa9fc28e09b35b44_E22SCARCHA2216326_5.jpeg", "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/cc7f77f735d92a543f8db5d21b2fac56e8bbdd99_E22SCARCHA2216326_4.jpeg"],
        bids: [],
        dateOfSale: new Date('2024-11-12T14:00:00Z')
    },
    {
        id: 9,
        name: "Ocun Iris Red White",
        description: "The Ocun Iris Red White is a precision-focused climbing shoe offering comfort, flexibility, and a custom fit for narrow feet, ideal for indoor climbing and bouldering.",
        brand: brands[3],
        level: levels[2],
        closing: closing[1],
        toepatch: true,
        colors: [colors[2], colors[6]],
        images: ["https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/a1a53e7bba2c1a32af16c18e80be9fc8455f98e9_E24OCUNCHA4428188_0.jpeg", "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/6d8faf2c9c0792902b997071f69a23552a8c5a06_E24OCUNCHA4428188_1.jpeg", "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/9ea60cec2f8f387f6e459ffb397a8a377d189ea4_E24OCUNCHA4428188_2.jpeg"],
        bids: [],
        dateOfSale: new Date('2024-11-15T15:00:00Z')
    },
    {
        id: 10,
        name: "La Sportiva Tarantulace Olive Tiger",
        description: "Ideal for beginner and intermediate climbers with narrow feet, the La Sportiva Tarantulace rock climbing shoe offers grip and support for bouldering or route climbing.",
        brand: brands[2],
        level: levels[0],
        closing: closing[0],
        toepatch: false,
        colors: [colors[2], colors[3]],
        images: ["https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/fdf9abe39437c8f2f777ff5cced7fc53dcfe83b8_E23LASPCHA3349723_0.jpeg", "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/f2b5c86543dbc249de46013b2993cacb7c0393bc_E23LASPCHA3349723_2.jpeg", "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/735/735/beae1d6b2da4f3fddddc9ba21243b448169aaf18_E23LASPCHA3349723_7.jpeg"],
        bids: [],
        dateOfSale: new Date('2025-03-30T13:00:00Z')
    }
];

// Export products and filter options
export default { products, brands, levels, closing, colors };
