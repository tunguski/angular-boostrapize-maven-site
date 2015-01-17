# Project

The goal of this project is to modernize maven generated sites without changing
default maven site plugin.

# What's done?

| Subject | What's done |
| ------: | :---------- |
| **Look & Feel** | Mobile first |
| | Responsive by design |
| | `Bootstrap 3.3` for layout |
| | `Angular 1.3` for dynamic parts |
| **Code highlight** | Automatic code parts detection based on `highlightjs.org` |
| **Table of content** | Built basing on headers (`h1`, `h2`, `h3`) from page source |
| **Page header** | Created from breadcrumb |
| **Java source (JXR)** | Built without frames with same style as main page. |
| **Reports** | Dynamic creating reports from page source: |
| | **Linkage report** - shows broken links (only within page, no external links examined), size of site ect. |

# What's to be done?

* Improve page header generation
    * Today it creates only one link from whole breadcrumb
* In-page anchors are broken
* Replace anchor based location to path based (HTML5)
* Javadocs are broken
