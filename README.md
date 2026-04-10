# 🌍 Country Comparer

![Country Comparer Banner](banner.png)

A premium, high-performance web application designed for global data analysis. **Country Comparer** allows users to visualize and compare key statistics between any two nations in real-time, providing deep insights into demographics, geography, and economy.

---

## ✨ Features

- **⚖️ Side-by-Side Comparison**: Compare two countries with a dedicated dual-panel interface.
- **📊 Visual Data Scaling**: Dynamic percentage bars and "Winner" badges visually highlight the differences in population and area.
- **🧠 Intelligent Summaries**: Automatically generates natural language insights (e.g., *"Country A is 5.2x larger than Country B"*).
- **🎨 Glassmorphism UI**: A state-of-the-art dark mode interface with blurred backgrounds, vibrant gradients, and smooth animations.
- **🔍 Advanced Search**: Interactive dropdowns featuring 250+ countries with alphabetical sorting.
- **🔀 Discovery Mode**: A "Random Comparison" feature to explore unpredictable pairs across the globe.
- **📱 Responsive Design**: Fully optimized for desktop, tablet, and mobile viewing.

---

## 🛠️ Tech Stack

- **Core**: HTML5, CSS3, ES6+ JavaScript
- **Icons**: [Lucide Icons](https://lucide.dev/) for a clean, modern aesthetic.
- **Typography**: [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts.
- **Data Source**: [REST Countries API](https://restcountries.com/) (Live Version 3.1).

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge).
- No API keys or environmental variables are required.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Vaishvi-Pan/Country-Comparator.git
   ```
2. Navigate to the project folder:
   ```bash
   cd country-comparator
   ```
3. Open `index.html` in your browser.

---

## 🏗️ Architecture & Logic

The application follows a **functional programming approach** to handle data transformations and UI updates:

- **Data Fetching**: Uses the Fetch API to retrieve real-time global statistics.
- **State Management**: A centralized `selectedData` object tracks currently viewed countries.
- **Functional Patterns**: 
    - `map()`: Generates dropdown options from raw API data.
    - `filter()`: Ensures data integrity and finds regional counterparts for context.
    - `sort()`: Maintains alphabetical order for optimized user search.
- **Dynamic Rendering**: Template literals are used to render complex cards without external frameworks, keeping the bundle size near zero.

---

## 🔮 Roadmap

- [ ] **Historical Data**: Integration of time-series data for GDP and population trends.
- [ ] **Dark/Light Toggle**: Adding a dedicated theme switcher.
- [ ] **Export to PDF**: Ability to download comparison reports.
- [ ] **Map Integration**: Adding an interactive Leaflet map to show country locations.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you have ideas to improve the interface or add new data metrics.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Designed with ❤️ by [Your Name/GitHub]*
