# Sort Animation

Sort Animation is a web‑based visualization tool for demonstrating the behavior of common sorting algorithms. The application is implemented in vanilla JavaScript and HTML5 Canvas without external frameworks.

---

## Getting Started

Clone the repository and launch a local HTTP server:

```bash
git clone https://github.com/zabaglione/sort_animation.git
cd sort_animation
python3 -m http.server 8000
# Open http://localhost:8000/index.html in your browser
```

`sort_animation.html` can also be opened directly in a browser, but some browsers restrict local file access. Using a local server is therefore recommended.

---

## Features

| Function                | Description                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| Algorithm selection     | Bubble, Selection, Insertion, Merge, Quick, and other sorting algorithms                      |
| Animation speed control | Adjustable via slider during execution                                                        |
| Step execution          | Execute the algorithm one step at a time, with forward and backward navigation                |
| Variable array size     | Configure the number of elements to observe the scalability characteristics of each algorithm |
| Statistics              | Real‑time display of comparison and swap counts                                               |

---

## Directory Structure

```
.
├── sort_animation.html   # User interface
├── sort_animation.js     # Sorting algorithms and rendering logic
└── README.md             # Project documentation
```

---

## Contributing

Bug fixes, additional algorithms, and user‑interface improvements are welcome.

1. Fork the repository and create a feature branch.
2. Commit changes with clear, descriptive messages.
3. Open a pull request targeting the `main` branch.

Source code should be formatted with Prettier. Where applicable, please include unit tests (Jest).

---

## License

This project is licensed under the CC0.

