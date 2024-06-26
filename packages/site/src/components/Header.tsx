import { useContext } from 'react';
import styled, { useTheme } from 'styled-components';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from 'react';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, getThemePreference, getSnap } from '../utils';
import { HeaderButtons } from './Buttons';
import { SnapLogo } from './SnapLogo';
import { Toggle } from './Toggle';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2.4rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border?.default};
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  margin: 0;
  margin-left: 1.2rem;
  ${({ theme }) => theme.mediaQueries.small} {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Header = ({
  handleToggleClick,
}: {
  handleToggleClick(): void;
}) => {
  const theme = useTheme();
  const [state, dispatch] = useContext(MetaMaskContext);

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState('mainnet');

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleNetworkSelect = (network) => {
    setSelectedNetwork(network);
    handleDropdownClose();
  };
  return (
    <HeaderWrapper>
      <LogoWrapper>
        <SnapLogo color={theme.colors.icon?.default} size={36} />
        <Title>SNAPTOS</Title>
      </LogoWrapper>
      <RightContainer>
        <div
          style={{
            font: 'Roboto',
            fontSize: '1.6rem',
            border: '1px solid #000',
            
            borderRadius: '10px',
            width: '10rem',
            height: '3.4rem',
            textAlign: 'center',
            lineHeight: '3rem',
            display: 'inline-block',
          }}
        >
          {selectedNetwork.toUpperCase()}{' '}
          {/* Display the selected network in uppercase */}
          <ArrowDropDownCircleOutlinedIcon
            style={{
              fontSize: 15,
              color: '#434343',
              lineHeight: '3rem',          
              display: 'inline-block'
            }}
            onClick={handleDropdownClick}
          />
        </div>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleDropdownClose}
        >
          <MenuItem
            onClick={() => handleNetworkSelect('mainnet')}
            sx={{ fontSize: '15px', font: 'Roboto' }}
          >
            Mainnet
          </MenuItem>
          <MenuItem
            onClick={() => handleNetworkSelect('testnet')}
            sx={{ fontSize: '15px', font: 'Roboto' }}
          >
            Testnet
          </MenuItem>
          <MenuItem
            onClick={() => handleNetworkSelect('devnet')}
            sx={{ fontSize: '15px', font: 'Roboto' }}
          >
            Devnet
          </MenuItem>
                   
        </Menu>{' '}
        <div style={{ marginRight: '20px' }} />
        <Toggle
          onToggle={handleToggleClick}
          defaultChecked={getThemePreference()}
        />
        <HeaderButtons state={state} onConnectClick={handleConnectClick} />
      </RightContainer>
    </HeaderWrapper>
  );
};
