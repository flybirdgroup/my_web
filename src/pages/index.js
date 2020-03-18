import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>人工智能</>,
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        分享关于人工智能领域的一些好玩项目,比如图像领域的人脸识别,NLP领域的情感分析,文本分类,语音识别,推荐系统的用户画像等好玩项目
      </>
    ),
  },
  {
    title: <>大数据,云服务</>,
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        分享一些有趣的大数据项目,比如房地产价格预测,网站后端用户浏览习惯行为分析,利用谷歌云搭建深度学习平台等
      </>
    ),
  },
  {
    title: <>网站初衷</>,
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        让更多人的人喜欢人工智能,大数据和云服务,同时也让自己受益
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/doc1')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
