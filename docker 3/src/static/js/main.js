// Event listener for YouTube URL form submission
// Event listener for YouTube URL form submission
document.getElementById('urlForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const url = document.getElementById('youtubeURL').value;
    const videoId = extractVideoID(url);

    if (videoId) {
        const iframe = document.getElementById('youtubePlayer');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`; // Add autoplay parameter

        // Update the video feed source
        const videoFeed = document.getElementById('videoFeed');
        videoFeed.src = `/video_feed?youtube_url=${encodeURIComponent(url)}`;
        openTabByName('Result'); // Open the Result tab
    } else {
        alert('Invalid YouTube URL');
    }
});

// Function to extract YouTube video ID from URL
function extractVideoID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}


// Event listener for brand form submission
document.getElementById('brandForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const brandName = document.getElementById('brandName').value;
    fetchImages(brandName);
});
// Function to fetch default logos and display them
function fetchDefaultLogos() {
    const defaultLogos = [
        { name: 'Sponsor', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSemrQWr12YgGjI8fdfWApr3rmVqGjIF5QtDQ&s', category: 'drink' },
        { name: 'Est', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU_Ck-BgNnr91GvwgfBA1-E7wooDeB4-kTIw&s', category: 'drink' },
        { name: 'Chang', url: 'https://www.marketingbangkok.com/sites/default/files/2019-04/chang_logo.jpg', category: 'drink' },
        { name: 'M-150', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF-zvNKn7VutPh39DN4wqCL5KjlvFIxn5xSQ&s', category: 'drink' },

        { name: 'Lays', url: 'https://pbs.twimg.com/profile_images/1174678997374033920/5_6IucF8_400x400.png', category: 'snack' },
        { name: 'Euro Cake', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJq5B2LqTj5TDXi-aSzsSrKjczQPZIkKpkmA&s', category: 'snack' },

        { name: 'Grand Sport', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhOwFrrh0ruwLXGiPY99E2JKYdwE2UCvQH9A&s', category: 'sport-shirt' },
        { name: 'Mikasa', url: 'https://www.north49decals.com/cdn/shop/products/mikasa_2.jpg?v=1570557496', category: 'sport-shirt' },
        { name: 'Warrix', url: 'https://inwfile.com/s-cx/x3mf1v.jpg', category: 'sport-shirt' },

        { name: 'Isuzu', url: 'https://v3i.rweb-images.com/www.nktbrake.com/images/content/original-1549334111839.png', category: 'engine' },
        { name: 'Toyota', url: 'https://st3.depositphotos.com/1050070/13594/i/450/depositphotos_135946198-stock-photo-the-brand-on-computer-screen.jpg', category: 'engine' },
        { name: 'Honda', url: 'https://static.vecteezy.com/system/resources/previews/020/500/822/original/honda-logo-brand-symbol-with-name-red-design-japan-car-automobile-illustration-with-black-background-free-vector.jpg', category: 'engine' },

        { name: 'Dove', url: 'https://www.unilever.co.th/content-images/92ui5egz/production/db75ae243befa00aa3cdb2eaf546b0c3aa2ab5d2-1080x1080.jpg?w=375&h=375&fit=crop&auto=format', category: 'hair-care' },
        { name: 'Clear', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZsmze3Z47uWDJNJCxdtZpUqJ8k0Yohbta5Q&s', category: 'hair-care' },
        { name: 'Sunsilk', url: 'https://resources.commerceup.io/?key=https%3A%2F%2Fprod-admin-images.s3.ap-south-1.amazonaws.com%2FpWVdUiFHtKGqyJxESltt%2Fbanner%2Fimage-OCiuonFZx.jpg&width=1000&resourceKey=pWVdUiFHtKGqyJxESltt&background=no', category: 'hair-care' },
    ];

    const defaultLogosContainer = document.getElementById('defaultLogos');
    defaultLogos.forEach(logo => {
        const imgElement = document.createElement('img');
        imgElement.src = logo.url;
        imgElement.alt = `${logo.name} logo`;
        imgElement.className = 'brand-image';
        imgElement.dataset.category = logo.category; // Set the category data attribute
        imgElement.addEventListener('click', handleImageClick);
        defaultLogosContainer.appendChild(imgElement);
    });

    // Display all images by default
    filterByCategory('all');
}

// Function to filter logos by category
function filterByCategory(category) {
    const logos = document.querySelectorAll('.brand-image');

    logos.forEach(logo => {
        logo.style.display = (category === 'all' || logo.dataset.category === category) ? 'block' : 'none';
    });
}

// Function to fetch and display images for a specific brand
function fetchImages(brandName) {
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = '';

    const defaultLogosContainer = document.getElementById('defaultLogos');
    defaultLogosContainer.style.display = 'none';

    // Define custom images for specific brands
    const customImages = {
        'sponsor': ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSemrQWr12YgGjI8fdfWApr3rmVqGjIF5QtDQ&s'],
        'est': ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU_Ck-BgNnr91GvwgfBA1-E7wooDeB4-kTIw&s'],
        'chang': ['https://www.marketingbangkok.com/sites/default/files/2019-04/chang_logo.jpg'],
        'm-150': ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF-zvNKn7VutPh39DN4wqCL5KjlvFIxn5xSQ&s'],
        'lays': ['https://pbs.twimg.com/profile_images/1174678997374033920/5_6IucF8_400x400.png'],
        'euro': ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJq5B2LqTj5TDXi-aSzsSrKjczQPZIkKpkmA&s'],
        'isuzu': ['https://v3i.rweb-images.com/www.nktbrake.com/images/content/original-1549334111839.png'],
        'toyota': ['https://st3.depositphotos.com/1050070/13594/i/450/depositphotos_135946198-stock-photo-the-brand-on-computer-screen.jpg'],
        'honda': ['https://static.vecteezy.com/system/resources/previews/020/500/822/original/honda-logo-brand-symbol-with-name-red-design-japan-car-automobile-illustration-with-black-background-free-vector.jpg'],
        'grand sport': ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhOwFrrh0ruwLXGiPY99E2JKYdwE2UCvQH9A&s'],
        'mikasa': ['https://www.north49decals.com/cdn/shop/products/mikasa_2.jpg?v=1570557496'],
        'warrix': ['https://inwfile.com/s-cx/x3mf1v.jpg'],
        'dove': ['https://www.unilever.co.th/content-images/92ui5egz/production/db75ae243befa00aa3cdb2eaf546b0c3aa2ab5d2-1080x1080.jpg?w=375&h=375&fit=crop&auto=format'],
        'clear': ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZsmze3Z47uWDJNJCxdtZpUqJ8k0Yohbta5Q&s'],
        'sunsilk': ['https://resources.commerceup.io/?key=https%3A%2F%2Fprod-admin-images.s3.ap-south-1.amazonaws.com%2FpWVdUiFHtKGqyJxESltt%2Fbanner%2Fimage-OCiuonFZx.jpg&width=1000&resourceKey=pWVdUiFHtKGqyJxESltt&background=no'],
    };

    if (customImages[brandName.toLowerCase()]) {
        // Display custom images for the brand
        customImages[brandName.toLowerCase()].forEach(url => {
            const imgElement = document.createElement('img');
            imgElement.src = url;
            imgElement.alt = `${brandName} logo`;
            imgElement.className = 'brand-image';
            imgElement.style.width = '140px'; // Adjust size as needed
            imgElement.style.height = 'auto'; // Maintain aspect ratio
            imgElement.addEventListener('click', handleImageClick);
            imageContainer.appendChild(imgElement);
        });
    } else {
        // Search in default logos if not a custom brand
        const logo = defaultLogos.find(logo => logo.name.toLowerCase() === brandName.toLowerCase());

        if (logo) {
            const imgElement = document.createElement('img');
            imgElement.src = logo.url;
            imgElement.alt = `${logo.name} logo`;
            imgElement.className = 'brand-image';
            imgElement.style.width = '100px'; // Adjust size as needed
            imgElement.style.height = 'auto'; // Maintain aspect ratio
            imgElement.addEventListener('click', handleImageClick);
            imageContainer.appendChild(imgElement);
        } else {
            imageContainer.innerHTML = '<p>No image found for this brand.</p>';
        }
    }
}

// Function to update category counts
function updateCategoryCounts() {
    const categoryLinks = document.querySelectorAll('.category-link');
    const selectedImages = document.querySelectorAll('.brand-image.selected');

    // Create a dictionary to keep track of counts
    const categoryCounts = {
        'drink': 0,
        'snack': 0,
        'sport-shirt': 0,
        'engine': 0,
        'hair-care': 0,
    };

    // Count selected images per category
    selectedImages.forEach(img => {
        const category = img.dataset.category;
        if (categoryCounts[category] !== undefined) {
            categoryCounts[category]++;
        }
    });

    // Update category link text
    categoryLinks.forEach(link => {
        const category = link.getAttribute('onclick').match(/'([\w-]+)'/)[1];
        const count = categoryCounts[category];
        link.textContent = `${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}${count > 0 ? ` (${count})` : ''}`;
    });
}

// Function to handle image click events
function handleImageClick() {
    const selectedImages = document.querySelectorAll('.brand-image.selected');

    if (this.classList.contains('selected')) {
        this.classList.remove('selected');
        updateImageNumbers();
    } else {
        if (selectedImages.length < 3) {
            this.classList.add('selected');
            updateImageNumbers();
        } else {
            alert('You can select up to 3 images only.');
        }
    }

    // Enable or disable the YouTube input based on selected images
    const youtubeInput = document.getElementById('youtubeURL');
    youtubeInput.disabled = selectedImages.length === 0;

    // Update category counts
    updateCategoryCounts();
}

// Function to update image numbers
function updateImageNumbers() {
    const selectedImages = document.querySelectorAll('.brand-image.selected');

    selectedImages.forEach((img, index) => {
        let numberElement = img.querySelector('.number');
        if (!numberElement) {
            numberElement = document.createElement('div');
            numberElement.className = 'number';
            img.appendChild(numberElement);
        }
        numberElement.textContent = index + 1;
    });

    document.querySelectorAll('.brand-image:not(.selected) .number').forEach(num => num.remove());
}

// Function to handle tab switching
function openTab(event, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    const tablinks = document.getElementsByClassName("tablink");

    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    document.getElementById(tabName).style.display = "block";
    event.currentTarget.style.backgroundColor = "#575757";
}

// Function to open tab by name
function openTabByName(tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    const tablinks = document.getElementsByClassName("tablink");

    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    document.getElementById(tabName).style.display = "block";
    const activeTabButton = document.querySelector(`button[onclick="openTab(event, '${tabName}')"]`);
    if (activeTabButton) {
        activeTabButton.style.backgroundColor = "#575757";
    }
}

// Initialize default logos on page load
document.addEventListener('DOMContentLoaded', fetchDefaultLogos);






// ส่งข้อมูลไปที่ Flask API และรับผลลัพธ์การพยากรณ์
async function getPrediction(inputData) {
    const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: inputData })
    });

    const data = await response.json();
    console.log('Prediction:', data.prediction);

    // แสดงผลลัพธ์ที่หน้าเว็บ
    const resultContainer = document.getElementById('Result');
    resultContainer.innerHTML = `<p>Predicted brand: ${data.prediction}</p>`;
}
