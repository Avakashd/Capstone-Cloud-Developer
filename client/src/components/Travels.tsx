import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Form,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import {
  createtravel,
  deletetravel,
  gettravels,
  patchtravel,
  checkAttachmentURL
} from '../api/travels-api'
import Auth from '../auth/Auth'
import { travel } from '../types/travel'
import Typist from 'react-typist'

interface travelsProps {
  auth: Auth
  history: History
}

interface travelsState {
  travels: travel[]
  newtravelName: string
  loadingtravels: boolean
}

export class Travels extends React.PureComponent<travelsProps, travelsState> {
  state: travelsState = {
    travels: [],
    newtravelName: '',
    loadingtravels: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newtravelName: event.target.value })
  }

  onEditButtonClick = (travelId: string) => {
    this.props.history.push(`/travels/${travelId}/edit`)
  }

  ontravelCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newtravel = await createtravel(this.props.auth.getIdToken(), {
        name: this.state.newtravelName,
        dueDate
      })
      this.setState({
        travels: [...this.state.travels, newtravel],
        newtravelName: ''
      })
    } catch {
      alert('travel creation failed')
    }
  }

  ontravelDelete = async (travelId: string) => {
    try {
      await deletetravel(this.props.auth.getIdToken(), travelId)
      this.setState({
        travels: this.state.travels.filter((travel) => travel.travelId != travelId)
      })
    } catch {
      alert('travel deletion failed')
    }
  }

  ontravelCheck = async (pos: number) => {
    try {
      const travel = this.state.travels[pos]
      await patchtravel(this.props.auth.getIdToken(), travel.travelId, {
        name: travel.name,
        dueDate: travel.dueDate,
        done: !travel.done
      })
      this.setState({
        travels: update(this.state.travels, {
          [pos]: { done: { $set: !travel.done } }
        })
      })
    } catch {
      alert('travel update failed')
    }
  }

  onCheckAttachmentURL = async (
    travel: travel,
    pos: number
  ): Promise<boolean> => {
    try {
      const response = travel.attachmentUrl
        ? await checkAttachmentURL(travel.attachmentUrl)
        : false

      this.setState({
        travels: update(this.state.travels, {
          [pos]: { validUrl: { $set: response } }
        })
      })

      return true
    } catch {
      return false
    }
  }

  async componentDidMount() {
    try {
      const travels = await gettravels(this.props.auth.getIdToken())

      this.setState({
        travels,
        loadingtravels: false
      })

      this.state.travels.map(async (travel, pos) => {
        travel['validUrl'] = travel.attachmentUrl
          ? await this.onCheckAttachmentURL(travel, pos)
          : false

        return travel
      })
    } catch (e) {
      alert(`Failed to fetch travels: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Typist>
          <Header as="h1">Your Experience...</Header>
        </Typist>
        {this.renderCreatetravelInput()}

        {this.rendertravels()}
      </div>
    )
  }

  renderCreatetravelInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Trip',
              onClick: this.ontravelCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Experience"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  rendertravels() {
    if (this.state.loadingtravels) {
      return this.renderLoading()
    }

    return this.rendertravelsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading your thoughts...
        </Loader>
      </Grid.Row>
    )
  }

  rendertravelsList() {
    return (
      <Grid padded>
        {this.state.travels.map((travel, pos) => {
          return (
            <Grid.Row key={travel.travelId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.ontravelCheck(pos)}
                  checked={travel.done}
                />
              </Grid.Column>

              <Grid.Column width={10} verticalAlign="middle">
                {travel.name}
              </Grid.Column>

              <Grid.Column width={3} floated="right">
                {travel.dueDate}
              </Grid.Column>

              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(travel.travelId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>

              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.ontravelDelete(travel.travelId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>

              {travel.attachmentUrl && travel.validUrl ? (
                <Image
                  src={travel.attachmentUrl}
                  size="small"
                  wrapped
                  centered
                />
              ) : null}

              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate())
    return dateFormat(date, 'yyyy-mm-dd hh:mm:ss') as string
  }
}
