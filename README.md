# Gutenberg Test Utils

[![npm version](https://badge.fury.io/js/%40technote-space%2Fgutenberg-test-utils.svg)](https://badge.fury.io/js/%40technote-space%2Fgutenberg-test-utils)
[![CI Status](https://github.com/technote-space/gutenberg-test-helper/workflows/CI/badge.svg)](https://github.com/technote-space/gutenberg-test-helper/actions)
[![codecov](https://codecov.io/gh/technote-space/gutenberg-test-helper/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/gutenberg-test-helper)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/gutenberg-test-helper/badge)](https://www.codefactor.io/repository/github/technote-space/gutenberg-test-helper)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/gutenberg-test-helper/blob/master/LICENSE)

This is a gutenberg's test utils.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [How to use](#how-to-use)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How to use
1. Install
    ```bash
    npm install --save-dev @technote-space/gutenberg-test-helper
    ```

1. Setup

    `jest.config.js`
    ```js
    module.exports = {
        // ...

        setupFiles: ['<rootDir>/jest.setup.ts']
    };
    
    ```
    `jest.setup.ts`
    ```typescript
    import { setupGlobal } from '@technote-space/gutenberg-test-helper';
    
    setupGlobal();
    ```

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
