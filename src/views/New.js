import React, { useEffect, useRef, useState } from 'react'

import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react-pro'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

import BurndownProvider from '../data/BurndownProvider'
import { useNavigate } from 'react-router-dom'
import { Loading } from 'src/components'

const New = () => {
  const [showLoading, setShowLoading] = useState(false)

  const [error, setError] = useState(null)
  const [days, setDays] = useState(10)
  const title = useRef('Burndown')
  const [points, setPoints] = useState(100)
  const [labels, setLabels] = useState([])
  const [idealData, setIdealData] = useState([])

  const navigate = useNavigate()

  const calcIdealData = () => {
    const newLabels = []
    const newIdealData = []

    const idealHoursPerDay = points / (days - 1)
    for (let idx = 1; idx <= days; idx++) {
      newLabels.push(`Dia ${idx}`)
      newIdealData.push(Math.round(points - idealHoursPerDay * (idx - 1)))
    }

    setLabels(newLabels)
    setIdealData(newIdealData)
  }

  const handleInputChange = (e) => {
    e.preventDefault()
    if (e.target.name === 'title') {
      title.current = e.target.value
    } else if (e.target.name === 'points') {
      let value = e.target.value
      if (value) {
        value = Math.round(Math.min(9999, Math.max(0, e.target.value)))
      }
      setPoints(value)
    } else if (e.target.name === 'days') {
      let value = e.target.value
      if (value) {
        value = Math.round(Math.min(60, Math.max(0, e.target.value)))
      }
      setDays(value)
    }
  }

  const createBurndown = () => {
    setError(null)
    console.log(title)

    if (!(title.current.trim() !== '' && days !== '' && points !== '')) {
      setError('Por favor, preencha todos os campos.')
      return
    }

    if (days != Math.round(Math.min(60, Math.max(2, days)))) {
      setError('Dias deve ser um inteiro entre 2 e 60.')
      return
    }

    if (points != Math.round(Math.min(9999, Math.max(1, points)))) {
      setError('Pontos deve ser um inteiro entre 1 e 9999.')
      return
    }

    setShowLoading(true)
    BurndownProvider.create({
      title: title.current.trim().substring(0, 50),
      days: days,
      sprintPoints: points,
      points: [points],
    })
      .then((key) => {
        setShowLoading(false)
        navigate(`/${key}`, { replace: true })
      })
      .catch(() => {
        setShowLoading(false)
      })
  }

  useEffect(() => {
    calcIdealData()
  }, [])

  return (
    <>
      {showLoading ? (
        <Loading />
      ) : (
        <CRow>
          <CCol lg={4}>
            <CCard>
              <CCardBody>
                {error ? <CAlert color="danger">{error}</CAlert> : null}
                <div className="mb-2">
                  <CFormLabel htmlFor="title">Título</CFormLabel>
                  <CFormInput
                    type="text"
                    name="title"
                    defaultValue={title.current}
                    maxLength={50}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="mb-2">
                  <CFormLabel htmlFor="days">Quantidade de dias</CFormLabel>
                  <CFormInput
                    type="number"
                    name="days"
                    value={days}
                    min={2}
                    max={90}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="mb-2">
                  <CFormLabel htmlFor="points">Total de pontos</CFormLabel>
                  <CFormInput
                    type="number"
                    name="points"
                    value={points}
                    min={1}
                    max={2000}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <CButton onClick={() => createBurndown()} className="mt-2" color="primary">
                  Criar burndown
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol lg={8}>
            <CRow>
              <CCol lg={12}>
                <CCard>
                  <CCardBody>
                    <CChartLine
                      className="mt-3"
                      style={{ height: '500px' }}
                      data={{
                        labels: labels,
                        datasets: [
                          {
                            label: 'Ideal',
                            backgroundColor: `rgba(${getStyle('--cui-success-rgb')}, .1)`,
                            borderColor: getStyle('--cui-success'),
                            borderWidth: 6,
                            data: idealData,
                            fill: false,
                            tension: 0,
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            display: true,
                          },
                          y: {
                            beginAtZero: true,
                            display: true,
                          },
                        },
                        elements: {
                          line: {
                            borderWidth: 2,
                            tension: 0.4,
                          },
                          point: {
                            radius: 2,
                            hitRadius: 10,
                            hoverRadius: 4,
                          },
                        },
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      )}
    </>
  )
}

export default New
