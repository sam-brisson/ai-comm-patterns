import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/ai-comm-patterns/blog',
    component: ComponentCreator('/ai-comm-patterns/blog', '9ae'),
    exact: true
  },
  {
    path: '/ai-comm-patterns/blog/archive',
    component: ComponentCreator('/ai-comm-patterns/blog/archive', 'a1f'),
    exact: true
  },
  {
    path: '/ai-comm-patterns/blog/authors',
    component: ComponentCreator('/ai-comm-patterns/blog/authors', 'd7c'),
    exact: true
  },
  {
    path: '/ai-comm-patterns/blog/authors/all-sebastien-lorber-articles',
    component: ComponentCreator('/ai-comm-patterns/blog/authors/all-sebastien-lorber-articles', 'ff3'),
    exact: true
  },
  {
    path: '/ai-comm-patterns/blog/authors/yangshun',
    component: ComponentCreator('/ai-comm-patterns/blog/authors/yangshun', '66b'),
    exact: true
  },
  {
    path: '/ai-comm-patterns/blog/first-blog-post',
    component: ComponentCreator('/ai-comm-patterns/blog/first-blog-post', 'c44'),
    exact: true
  },
  {
    path: '/ai-comm-patterns/blog/long-blog-post',
    component: ComponentCreator('/ai-comm-patterns/blog/long-blog-post', 'e02'),
    exact: true
  },
  {
    path: '/ai-comm-patterns/blog/mdx-blog-post',
    component: ComponentCreator('/ai-comm-patterns/blog/mdx-blog-post', '7c2'),
    exact: true
  },
  {
    path: '/ai-comm-patterns/blog/tags',
    component: ComponentCreator('/ai-comm-patterns/blog/tags', '9c8'),
    exact: true
  },
  {
    path: '/ai-comm-patterns/blog/tags/docusaurus',
    component: ComponentCreator('/ai-comm-patterns/blog/tags/docusaurus', '478'),
    exact: true
  },
  {
    path: '/ai-comm-patterns/blog/tags/facebook',
    component: ComponentCreator('/ai-comm-patterns/blog/tags/facebook', 'f64'),
    exact: true
  },
  {
    path: '/ai-comm-patterns/blog/tags/hello',
    component: ComponentCreator('/ai-comm-patterns/blog/tags/hello', '856'),
    exact: true
  },
  {
    path: '/ai-comm-patterns/blog/tags/hola',
    component: ComponentCreator('/ai-comm-patterns/blog/tags/hola', '065'),
    exact: true
  },
  {
    path: '/ai-comm-patterns/blog/welcome',
    component: ComponentCreator('/ai-comm-patterns/blog/welcome', '3ee'),
    exact: true
  },
  {
    path: '/ai-comm-patterns/markdown-page',
    component: ComponentCreator('/ai-comm-patterns/markdown-page', '6d9'),
    exact: true
  },
  {
    path: '/ai-comm-patterns/docs',
    component: ComponentCreator('/ai-comm-patterns/docs', '3c3'),
    routes: [
      {
        path: '/ai-comm-patterns/docs',
        component: ComponentCreator('/ai-comm-patterns/docs', '604'),
        routes: [
          {
            path: '/ai-comm-patterns/docs',
            component: ComponentCreator('/ai-comm-patterns/docs', 'c49'),
            routes: [
              {
                path: '/ai-comm-patterns/docs/category/tutorial---basics',
                component: ComponentCreator('/ai-comm-patterns/docs/category/tutorial---basics', 'cc7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ai-comm-patterns/docs/category/tutorial---extras',
                component: ComponentCreator('/ai-comm-patterns/docs/category/tutorial---extras', '915'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ai-comm-patterns/docs/intro',
                component: ComponentCreator('/ai-comm-patterns/docs/intro', '677'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ai-comm-patterns/docs/tutorial-basics/congratulations',
                component: ComponentCreator('/ai-comm-patterns/docs/tutorial-basics/congratulations', 'b35'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ai-comm-patterns/docs/tutorial-basics/create-a-blog-post',
                component: ComponentCreator('/ai-comm-patterns/docs/tutorial-basics/create-a-blog-post', '32f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ai-comm-patterns/docs/tutorial-basics/create-a-document',
                component: ComponentCreator('/ai-comm-patterns/docs/tutorial-basics/create-a-document', '9c3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ai-comm-patterns/docs/tutorial-basics/create-a-page',
                component: ComponentCreator('/ai-comm-patterns/docs/tutorial-basics/create-a-page', '634'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ai-comm-patterns/docs/tutorial-basics/deploy-your-site',
                component: ComponentCreator('/ai-comm-patterns/docs/tutorial-basics/deploy-your-site', '970'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ai-comm-patterns/docs/tutorial-basics/markdown-features',
                component: ComponentCreator('/ai-comm-patterns/docs/tutorial-basics/markdown-features', '4c1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ai-comm-patterns/docs/tutorial-extras/manage-docs-versions',
                component: ComponentCreator('/ai-comm-patterns/docs/tutorial-extras/manage-docs-versions', 'f69'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ai-comm-patterns/docs/tutorial-extras/translate-your-site',
                component: ComponentCreator('/ai-comm-patterns/docs/tutorial-extras/translate-your-site', '84f'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/ai-comm-patterns/',
    component: ComponentCreator('/ai-comm-patterns/', 'e4c'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
