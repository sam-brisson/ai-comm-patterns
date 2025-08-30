import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Collaboration',
    Svg: require('@site/static/img/ai-collab.svg').default,
    description: (
      <>
        How will Human-AI Collaboration (HAIC) change the way we collaborate?
        <br /><br />
        <Link
          className="button button--secondary button--lg"
          to="docs/collaboration/intro">
          Explore
        </Link>
      </>
    ),
  },
  {
    title: 'Trust',
    Svg: require('@site/static/img/ai-trust.svg').default,
    description: (
      <>
        How will Human-AI Collaboration (HAIC) change the way we trust and verify information?
        <br /><br />
        <Link
          className="button button--secondary button--lg"
          to="docs/trust/intro">
          Explore
        </Link>
      </>
    ),
  },
  {
    title: 'Experimentation',
    Svg: require('@site/static/img/ai-experiment.svg').default,
    description: (
      <>
        How will Human-AI Collaboration (HAIC) change the way we design and run experients?
        <br /><br />
        <Link
          className="button button--secondary button--lg"
          to="docs/experimentation/intro">
          Explore
        </Link>
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
