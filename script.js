class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    autoSuggest(prefix) {
        let node = this.root;
        for (let char of prefix) {
            if (!node.children[char]) {
                return [];
            }
            node = node.children[char];
        }
        return this.getWordsFromNode(node, prefix);
    }

    getWordsFromNode(node, prefix) {
        let words = [];
        if (node.isEndOfWord) words.push(prefix);
        for (let char in node.children) {
            words = words.concat(this.getWordsFromNode(node.children[char], prefix + char));
        }
        return words;
    }
}

const trie = new Trie();

fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt')
    .then(response => response.text())
    .then(text => {
        let words = text.split('\n').map(word => word.trim());
        words.forEach(word => trie.insert(word));
    });

function fetchSuggestions() {
    let query = document.getElementById("search").value;
    let suggestions = trie.autoSuggest(query);
    let suggestionsBox = document.getElementById("suggestions");
    suggestionsBox.innerHTML = "";

    if (suggestions.length > 0) {
        suggestionsBox.style.display = "block";
        suggestions.forEach(word => {
            let div = document.createElement("div");
            div.innerText = word;
            div.onclick = function() {
                document.getElementById("search").value = word;
                suggestionsBox.style.display = "none";
            };
            suggestionsBox.appendChild(div);
        });
    } else {
        suggestionsBox.style.display = "none";
    }
}

function refreshPage() {
    document.getElementById("search").value = "";
    document.getElementById("suggestions").innerHTML = "";
    document.getElementById("suggestions").style.display = "none";
}