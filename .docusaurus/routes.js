
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  
{
  path: '/',
  component: ComponentCreator('/'),
  exact: true,
  
},
{
  path: '/blog',
  component: ComponentCreator('/blog'),
  exact: true,
  
},
{
  path: '/blog/Attention',
  component: ComponentCreator('/blog/Attention'),
  exact: true,
  
},
{
  path: '/blog/createlinux',
  component: ComponentCreator('/blog/createlinux'),
  exact: true,
  
},
{
  path: '/blog/elmo',
  component: ComponentCreator('/blog/elmo'),
  exact: true,
  
},
{
  path: '/blog/hello_world',
  component: ComponentCreator('/blog/hello_world'),
  exact: true,
  
},
{
  path: '/blog/tags',
  component: ComponentCreator('/blog/tags'),
  exact: true,
  
},
{
  path: '/blog/tags/docusaurus',
  component: ComponentCreator('/blog/tags/docusaurus'),
  exact: true,
  
},
{
  path: '/blog/tags/facebook',
  component: ComponentCreator('/blog/tags/facebook'),
  exact: true,
  
},
{
  path: '/blog/tags/google-cloud',
  component: ComponentCreator('/blog/tags/google-cloud'),
  exact: true,
  
},
{
  path: '/blog/tags/hello',
  component: ComponentCreator('/blog/tags/hello'),
  exact: true,
  
},
{
  path: '/blog/tags/linux',
  component: ComponentCreator('/blog/tags/linux'),
  exact: true,
  
},
{
  path: '/blog/welcome',
  component: ComponentCreator('/blog/welcome'),
  exact: true,
  
},
{
  path: '/docs/:route',
  component: ComponentCreator('/docs/:route'),
  
  routes: [
{
  path: '/docs/GoogleAppEngine',
  component: ComponentCreator('/docs/GoogleAppEngine'),
  exact: true,
  
},
{
  path: '/docs/GoogleCloudStorage',
  component: ComponentCreator('/docs/GoogleCloudStorage'),
  exact: true,
  
},
{
  path: '/docs/TensorFlow',
  component: ComponentCreator('/docs/TensorFlow'),
  exact: true,
  
},
{
  path: '/docs/VisionAPI',
  component: ComponentCreator('/docs/VisionAPI'),
  exact: true,
  
},
{
  path: '/docs/createlinux',
  component: ComponentCreator('/docs/createlinux'),
  exact: true,
  
},
{
  path: '/docs/doc1',
  component: ComponentCreator('/docs/doc1'),
  exact: true,
  
},
{
  path: '/docs/doc2',
  component: ComponentCreator('/docs/doc2'),
  exact: true,
  
},
{
  path: '/docs/doc3',
  component: ComponentCreator('/docs/doc3'),
  exact: true,
  
},
{
  path: '/docs/doc4',
  component: ComponentCreator('/docs/doc4'),
  exact: true,
  
},
{
  path: '/docs/docker',
  component: ComponentCreator('/docs/docker'),
  exact: true,
  
},
{
  path: '/docs/mdx',
  component: ComponentCreator('/docs/mdx'),
  exact: true,
  
},
{
  path: '/docs/projects',
  component: ComponentCreator('/docs/projects'),
  exact: true,
  
}],
},
  
  {
    path: '*',
    component: ComponentCreator('*')
  }
];
