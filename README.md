# Gutenberg Test Utils

[![npm version](https://badge.fury.io/js/%40technote-space%2Fgutenberg-test-utils.svg)](https://badge.fury.io/js/%40technote-space%2Fgutenberg-test-utils)
[![CI Status](https://github.com/technote-space/gutenberg-test-utils/workflows/CI/badge.svg)](https://github.com/technote-space/gutenberg-test-utils/actions)
[![codecov](https://codecov.io/gh/technote-space/gutenberg-test-utils/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/gutenberg-test-utils)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/gutenberg-test-utils/badge)](https://www.codefactor.io/repository/github/technote-space/gutenberg-test-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/gutenberg-test-utils/blob/master/LICENSE)

This is a gutenberg's test utils.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Setup](#setup)
  - [yarn](#yarn)
  - [npm](#npm)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How to use
1. Install
    ```bash
    npm install --save-dev @technote-space/gutenberg-test-utils
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
    import { setupGlobal } from '@technote-space/gutenberg-test-utils';
    
    setupGlobal();
    ```

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
