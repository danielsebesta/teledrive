import { ArrowRightOutlined } from '@ant-design/icons'
import { Button, Card, Col, Divider, Layout, Row, Switch, Typography } from 'antd'
import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { fetcher, req } from '../utils/Fetcher'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

const Pricing: React.FC = () => {
  const history = useHistory()
  const { data: me } = useSWRImmutable('/users/me', fetcher)
  const [loading, setLoading] = useState<boolean>()
  const [isIDR, setIsIDR] = useState<boolean>(false)

  const select = (plan: 'free' | 'premium' | 'professional' | 'donation', provider?: string) => {
    if (plan === 'free' || me?.user.plan === plan) {
      return history.push('/login')
    }
    if (plan === 'premium') {
      if (me) {
        setLoading(true)
        return req.post('/subscriptions', {}, provider ? { params: { provider } } : {})
          .then(({ data }) => window.location.replace(data.link))
          .catch(() => setLoading(false))
      }
      return history.push('/login')
    }

    return window.open('https://www.buymeacoffee.com/mgilangjanuar', '_blank')
  }

  const Free = () => <Card color="warning" hoverable title="FREE" style={{ fontSize: '1rem' }} actions={[<Button block type="text" size="large">Select <ArrowRightOutlined /></Button>]} onClick={() => select('free')}>
    <Typography.Title style={{ textAlign: 'center', fontSize: '5em', fontWeight: 300 }}>
      <Typography.Text style={{ fontSize: '0.35em' }}>{isIDR ? 'Rp' : '$'}</Typography.Text>
      0
    </Typography.Title>
    <ul style={{ textAlign: 'center', listStyleType: 'none' }}>
      <li><strong>Unlimited</strong> total files</li>
      <li><strong>Unlimited</strong> total files size</li>
      <li><strong>1.5GB</strong> daily bandwidth</li>
      <li><strong>All basic features</strong></li>
    </ul>
  </Card>

  const Premium = () => <Card color="warning" hoverable title="Premium" style={{ fontSize: '1rem' }} actions={[<Button block loading={loading} type="text" size="large">{isIDR ? <>Powered by<strong> Midtrans</strong></> : <>Subscribe with<strong> PayPal</strong></>} <ArrowRightOutlined /></Button>]} onClick={() => isIDR ? select('premium', 'midtrans') : select('premium')}>
    <Typography.Title style={{ textAlign: 'center', fontSize: '5em', fontWeight: 300 }}>
      {isIDR ? <>
        <Typography.Text style={{ fontSize: '0.35em' }}>Rp</Typography.Text>144k
      </> : <>
        <Typography.Text style={{ fontSize: '0.35em' }}>$</Typography.Text>10
      </>}
      <Typography.Text style={{ fontSize: '0.35em' }}>/year</Typography.Text>
    </Typography.Title>
    <ul style={{ textAlign: 'center', listStyleType: 'none' }}>
      <li><strong>Unlimited</strong> total files</li>
      <li><strong>Unlimited</strong> total files size</li>
      <li><strong>Unlimited</strong> bandwidth usage</li>
      <li><strong>All features</strong></li>
    </ul>
  </Card>

  const Donation = () => <div style={{ textAlign: 'center' }}>
    <Typography.Title level={2}>
      Support us to keep this service running
    </Typography.Title>
    <br />
    <Typography.Paragraph>
      <a href="https://opencollective.com/teledrive/contribute" target="_blank">
        <img src="https://opencollective.com/teledrive/contribute/button@2x.png?color=blue" style={{ width: '100%', maxWidth: '300px' }} />
      </a>
    </Typography.Paragraph>
    <Typography.Paragraph>
      or, via <a href="https://paypal.me/mgilangjanuar" target="_blank">PayPal</a>.
    </Typography.Paragraph>
    <br />
    <Typography.Paragraph type="secondary">
      Feel free to <Link to="/contact?intent=sponsor">contact us</Link> if you have any questions or become a sponsor &mdash; or if you would like to help us in other ways.
    </Typography.Paragraph>
    {/* <script src="https://opencollective.com/teledrive/banner.js"></script> */}
  </div>

  return <>
    <Navbar user={me} page="pricing" />
    <Layout.Content className="container" style={{ marginTop: '80px' }}>
      <Row>
        <Col md={{ span: 20, offset: 2 }} span={24}>
          <Typography.Title level={4} style={{ textAlign: 'center', marginBottom: '70px' }}>
            USD 🇺🇸 &nbsp; <Switch onChange={e => setIsIDR(e)} /> &nbsp; IDR 🇮🇩
          </Typography.Title>
          <Row gutter={48} align="middle">
            <Col lg={{ span: 8, offset: 4 }} span={24} style={{ marginBottom: '35px' }}>
              <Free />
            </Col>
            <Col lg={{ span: 8 }} span={24} style={{ marginBottom: '35px' }}>
              <Premium />
            </Col>
          </Row>
          <Typography.Paragraph type="secondary" style={{ textAlign: 'center', marginBottom: '100px' }}>
            <Link to="/contact?intent=help">Contact us</Link> if you need help with the payment.
          </Typography.Paragraph>
          <Divider />
          <Row>
            <Col lg={{ span: 10, offset: 7 }} span={24}>
              <Donation />
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout.Content>
    <Footer />
  </>
}

export default Pricing