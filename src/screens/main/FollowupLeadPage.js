import { View, Text } from 'react-native'
import React from 'react'
import Leads from './Leads'
import HeaderWithBackButton from '../../components/HeaderWithBackButton'
import TabNavigator from '../../navigation/TabNavigator'
import FollowUpLeads from '../../components/FollowUpLeads'

const FollowupLeadPage = () => {
  return (
    <View>
      <HeaderWithBackButton headerText={'Follow up Leads'}/>
      <FollowUpLeads/>
      {/* <TabNavigator/> */}
    </View>
  )
}

export default FollowupLeadPage