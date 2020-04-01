import React, { Component } from 'react';
import Head from 'next/head'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import CardColumns from 'react-bootstrap/CardColumns'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import Image from 'react-bootstrap/Image'

import { formatDistance } from 'date-fns'
import { es } from 'date-fns/locale';

type Article = {
  source: ArticleSource,
  author: null | string,
  title: string,
  description: string,
  url: string,
  urlToImage: string,
  publishedAt: string,
  content: string,
}

type ArticleSource = {
  id: null | string,
  name: string
}

class Home extends Component<any, any> {
  constructor(props) {
    super(props);
    this.handleArticleClick = this.handleArticleClick.bind(this);
    this.fetchArticles = this.fetchArticles.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onCountrySelect = this.onCountrySelect.bind(this);
  }

  static getInitialProps = async function () {
    const { data } = await axios('https://ipinfo.io');

    return {
      country: data.country.toLowerCase()
    };
  };

  state = {
    isModalVisible: false,
    selectedCountry: 'ar',
    selectedArticle: null,
    articles: [],
    loading: true
  }

  componentDidMount() {
    const { country } = this.props;
    this.setState({
      selectedCountry: country
    }, () => {
      this.fetchArticles(country)
    })
  }

  handleArticleClick(selectedArticle: Article) {
    this.setState({
      selectedArticle,
      isModalVisible: true
    })
  }

  fetchArticles(country: string) {
    return axios
      .get(`/api/news?country=${country}`)
      .then(({ data }) => {
        this.setState({
          articles: data,
          loading: false
        })
      });
  }

  handleClose() {
    this.setState({
      isModalVisible: false
    })
  }

  getArticleFooter(sourceName: undefined | string, publishedAt: undefined | string) {
    if (sourceName && publishedAt) {
      let relativeTime = formatDistance(new Date(publishedAt), new Date(), { locale: es }).replace('alrededor de', '')
      return (
        <>
          {sourceName} &nbsp;·&nbsp; Hace {relativeTime}
        </>
      )
    }
  }

  onCountrySelect(event) {
    const country = event.target.value
    this.setState({
      selectedCountry: country,
      articles: [],
      loading: true
    }, () => {
      this.fetchArticles(country)
    })
  }

  render() {
    const {
      isModalVisible,
      selectedCountry,
      selectedArticle,
      articles,
      loading
    } = this.state;
    return (
      <div>
        <Head>
          <title>CVD19 News</title>
          <meta name='description' content='Agregador de noticias sobre el COVID-19' />
          <meta property='og:image' content='/og-image.png' />
          <meta
            name='viewport'
            content='initial-scale=1.0, width=device-width'
            key='viewport'
          />
        </Head>
        <header
          style={{
            marginBottom: '-7rem'
          }}
          className='bg-light'>
          <div style={{
            paddingTop: '3rem',
            paddingBottom: '9rem'
          }}>
            <div className='container'>
              <div className='d-flex'></div>
              <h1 className='title'>
                CVD19 News
              </h1>
              <div className='row'>
                <div className='col-12 col-sm-8 col-lg-9 col-xl-10'>
                  <p className='text-secondary'>Agregador de noticias sobre el COVID-19</p>
                </div>
                <div className='col-12 col-sm-4 col-lg-3 col-xl-2'>
                  <select
                    value={selectedCountry}
                    onChange={this.onCountrySelect}
                    name='countryPicker'
                    className='form-control form-control-sm'>
                    <option value='ar'>Argentina</option>
                    <option value='mx'>México</option>
                    <option value='ve'>Venezuela</option>
                    <option value='br'>Brasil</option>
                    <option value='us'>Estados Unidos</option>
                    <option value='au'>Australia</option>
                    <option value='it'>Italia</option>
                    <option value='fr'>Francia</option>
                    <option value='de'>Alemania</option>
                  </select>
                </div>
              </div>
              <hr className='mb-0' />
            </div>
          </div>
        </header>

        <Modal
          scrollable
          centered
          show={isModalVisible}
          onHide={this.handleClose}>
          <Modal.Body className='px-0 pt-0'>
            <Image width='100%' src={selectedArticle?.urlToImage} />
            <div className='pt-4 px-4'>
              <h4><strong>{selectedArticle?.title.split(' - ')[0]}</strong></h4>
              <p className='mb-0'>
                {selectedArticle?.content.replace(/\[(.*?)\]/, '')}
                <a target='_blank'
                  rel='noopener noreferrer'
                  href={selectedArticle?.url}>
                  Leer artículo completo
              </a>
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer className='justify-content-start bg-light'>
            {this.getArticleFooter(selectedArticle?.source.name, selectedArticle?.publishedAt)}
          </Modal.Footer>
        </Modal>

        <div className='container'>
          <main>
            {
              loading &&
              <div className='d-flex '>
                <FontAwesomeIcon className='mx-auto my-3' icon={faSpinner} pulse size='3x' />
              </div>
            }

            {
              articles.length > 0 &&
              <p>{articles.length} artículos encontrados</p>
            }
            <CardColumns>
              {
                articles &&
                articles.length > 0 &&
                articles.map(article => {
                  return (
                    <Card
                      style={{ cursor: 'pointer' }}
                      onClick={this.handleArticleClick.bind(null, article)}
                      className='mb-4 text-left'
                      key={article.url}>
                      <Card.Img variant='top' src={article.urlToImage ? article.urlToImage : '/img-placeholder.png'} />
                      <Card.Body>
                        <Card.Title className='mb-0'>
                          {article.title.split(' - ')[0]}
                        </Card.Title>
                      </Card.Body>
                      <Card.Footer className='text-muted border-0'>
                        {this.getArticleFooter(article.source.name, article.publishedAt)}
                      </Card.Footer>
                    </Card>
                  )
                })
              }
            </CardColumns>
            {
              !loading &&
              <div>
                <p className='lead text-center pt-4 pb-2 text-muted'>
                  Esas son todas las noticias por el momento
                </p>
              </div>
            }
          </main>

          <footer className='py-3 text-muted'>
            <hr />
            <p>Contribute to the project at <a href='https://newsapi.org'>Github</a></p>
            <p>Powered by <a href='https://newsapi.org'>News API</a></p>
          </footer>
        </div>
      </div>
    )
  }
}

export default Home;
