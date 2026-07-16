---
title: 'Interactive Menu Generator'
order: 0
category: 'Web App'
slug: 'menu-generator'
tags: ['Full Stack', 'Web App', 'PDF Generation']
image: './menu-generator/menu-generator-c.png'
hoverImage: './menu-generator/menu-generator.webp'
info: 'A full-stack web application that transforms structured menu data into an interactive editor and print-ready PDFs.'
description: 'A restaurant menu management tool that converts CSV data into an intuitive editing interface and automatically generates professionally formatted, print-ready PDFs.'
type: 'demo'
role: 'Software engineer'
timeline: '1 month'
completed: '12/2025'
credit: 'Menu Generator'
creditLink: 'https://menugen.insdash.ch'
tools: ['Vue.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Puppeteer']
activities: 'Designed and developed the application from end to end, transforming Figma and Canva designs into a production-ready web application. Built reusable Vue components, a CSV-driven editing workflow, multilingual support, dietary tagging, modular layouts, and a Puppeteer-powered HTML-to-PDF pipeline for generating consistent, print-ready menus.'
---

<div class="contentSection">

## Background

The project started with a simple goal: streamline the process of creating and maintaining restaurant menus without relying on graphic design software for every update. After designing the visual system in Figma and Canva, I developed a full-stack web application that enables restaurant staff to manage menu content through a structured CSV-based workflow. The application transforms the data into an intuitive editing interface and automatically generates pixel-perfect, print-ready PDFs, making menu updates faster, more consistent, and accessible to non-technical users.

#### Challenge

Updating menu items, prices, or seasonal offerings required manually editing design files and exporting new PDFs. This process was repetitive, error-prone, and difficult to maintain, especially when supporting multiple languages and print layouts.

#### Solution

I built MenuGen, a Vue.js and Node.js application that bridges the gap between design and content management. By separating content from presentation, restaurant staff can edit menu data through an intuitive interface while the system preserves the approved design and generates consistent, production-ready PDFs using Puppeteer.

#### A glimpse at behind the scene

Starting from the original Figma and Canva designs, I translated the design system into reusable Vue components, implemented multilingual support, dietary tagging, modular layouts, and a server-side HTML-to-PDF rendering pipeline. The project demonstrates how thoughtful software engineering can transform a static design into a scalable, maintainable product.

</div>

<div class="contentSection">

## Interactive Demo - See It In Action

#### Inline Edit

![MenuGen-inlineEdit](./2-inlineEdit.webp)

#### Edit Items

![MenuGen-itemEdit](./5-itemEdit.webp)

#### Upload Multi Pictures

![MenuGen-uploadPictures](./4-uploadPicture.webp)

#### Customize Icons

![MenuGen-iconEdit](./3-iconEdit.webp)

#### View in Single and Two Page

![MenuGen-twoPage](./6-twoPage.webp)

</div>

<div class="contentSection">

#### You can explore my side project on GitHub

<div>
  <a href="https://github.com/yingshiuan/menuGen" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/View%20on-GitHub-181717?logo=github&logoColor=white" alt="GitHub Repo - menuGen"
    style="height: 1.5rem; display: inline;">
  </a>
</div>

#### Try the demo

<div>
If you'd like to try Menu Generator, please click here:
<a
  href="https://menugen.insdash.ch"
  target="_blank"
  rel="noopener noreferrer"
>
  Menu Generator
</a>
</div>

</div>
