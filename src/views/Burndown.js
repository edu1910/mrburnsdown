import React, { useEffect, useRef, useState } from 'react'

import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CLink,
  CRow,
} from '@coreui/react-pro'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

import BurndownProvider from '../data/BurndownProvider'
import { useNavigate, useParams } from 'react-router-dom'
import { Loading } from 'src/components'

const Burndown = () => {
  const [showLoading, setShowLoading] = useState(true)
  const [object, setObject] = useState(null)
  const [error, setError] = useState(null)

  const day = useRef(0)
  const dayPoints = useRef(0)

  const [labels, setLabels] = useState([])
  const [idealData, setIdealData] = useState([])
  const [sprintData, setSprintData] = useState([])

  const { key } = useParams()
  const navigate = useNavigate()

  const showData = (obj) => {
    setObject(obj)
    const newLabels = []
    const newIdealData = []

    const idealHoursPerDay = obj.sprintPoints / (obj.days - 1)
    for (let idx = 1; idx <= obj.days; idx++) {
      newLabels.push(`Dia ${idx}`)
      newIdealData.push(Math.round(obj.sprintPoints - idealHoursPerDay * (idx - 1)))
    }

    day.current = Math.min(obj.days, obj.points.length + 1)
    dayPoints.current = obj.points[obj.points.length - 1]

    setLabels(newLabels)
    setIdealData(newIdealData)
    setSprintData(obj.points)
  }

  const handleInputChange = (e) => {
    if (e.target.name === 'dayPoints') {
      dayPoints.current = e.target.value
    } else if (e.target.name === 'day') {
      day.current = e.target.value
    }
  }

  const updateData = () => {
    setShowLoading(true)
    BurndownProvider.getByKey(key)
      .then((obj) => {
        if (obj !== null) {
          showData(obj)
          setShowLoading(false)
        } else {
          setShowLoading(false)
          navigate('/', { replace: true })
        }
      })
      .catch((e) => {
        setShowLoading(false)
        navigate('/', { replace: true })
      })
  }

  const saveBurndown = () => {
    setError(null)

    if (!(day.current !== '' && dayPoints.current !== '')) {
      setError('Por favor, preencha todos os campos.')
      return
    }

    if (day.current !== Math.min(object.days, Math.max(1, day.current))) {
      setError(`Dia deve ser um inteiro entre 1 e ${object.days}.`)
      return
    }

    if (dayPoints.current !== Math.min(9999, Math.max(0, dayPoints.current))) {
      setError('Pontos deve ser um inteiro entre 0 e 9999.')
      return
    }

    setShowLoading(true)
    let newPoints = object.points
    while (newPoints.length < day.current) {
      newPoints.push(newPoints[newPoints.length - 1])
    }
    newPoints[day.current - 1] = dayPoints.current

    BurndownProvider.update(key, {
      title: object.title,
      days: object.days,
      sprintPoints: object.sprintPoints,
      points: newPoints,
    })
      .then((key) => {
        setShowLoading(false)
        updateData()
      })
      .catch(() => {
        setShowLoading(false)
      })
  }

  useEffect(() => {
    updateData()
  }, [])

  return (
    <>
      {showLoading ? (
        <Loading />
      ) : (
        <CRow>
          <CCol lg={4}>
            <CCard>
              <CCardHeader>
                <div>
                  <h4>{object.title}</h4>
                </div>
                <div>
                  <small>Dias: {object.days}</small>
                </div>
                <div>
                  <small style={{ margin: 0 }}>Pontos da sprint: {object.sprintPoints}</small>
                </div>
              </CCardHeader>
              <CCardBody>
                {error ? <CAlert color="danger">{error}</CAlert> : null}
                <div className="mb-2">
                  <CFormLabel htmlFor="days">Dia</CFormLabel>
                  <CFormInput
                    type="number"
                    name="day"
                    defaultValue={day.current}
                    min={1}
                    max={90}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="mb-2">
                  <CFormLabel htmlFor="points">Pontos restantes</CFormLabel>
                  <CFormInput
                    type="number"
                    name="dayPoints"
                    defaultValue={dayPoints.current}
                    min={1}
                    max={2000}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <CButton onClick={() => saveBurndown()} className="mt-2" color="primary">
                    Definir valor
                  </CButton>
                  <CLink href="/">Novo burndown</CLink>
                </div>
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
                            label: 'Sprint',
                            backgroundColor: `rgba(${getStyle('--cui-danger-rgb')}, .1)`,
                            borderColor: getStyle('--cui-danger'),
                            borderWidth: 6,
                            data: sprintData,
                            fill: true,
                            tension: 0,
                          },
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

export default Burndown
