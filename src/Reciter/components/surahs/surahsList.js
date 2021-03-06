import React from 'react'
import styled, { css } from 'styled-components'
import * as R from 'ramda'
import { CSSTransitionGroup } from 'react-transition-group'
import { withRouter } from 'react-router-dom'
import qs from 'qs'
import './drop-animation.css'

const StyledBase = styled.div`
  font-family: 'Roboto', sans-serif;
  max-width: 720px;
  margin: 120px auto 100px;
  .options-list {
    position: absolute;
    border: 1px solid rgba(107, 124, 147, .4);
    background-color: #f6f9fc;
    color: #6b7c93;
    border-radius: 3px;
    z-index: 99;
    font-size: 13px;
    padding: 5px 0;
    box-shadow: 1px 1px 5px 1px rgba(0,0,0,.2);
    span {
      cursor: pointer;
      display: block;
      padding: 7px 10px;
      &:hover {
        background-color: #f0f1f3;
      }
    }
  }
`

const activeTrack = css`
  color: #116ecc;
  font-weight: 600;
`

const Row = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 10px 20px;
  color: #6b7c93;
  ${props => props.active && activeTrack};
  &.header {
    span {
      font-size: 14px;
      text-transform: uppercase;
    }
  }
  &:not(.header) {
    &:hover {
      background-color: #f0f1f3;
      .more-options {
        opacity: 1;
      }
    }
  }
  span.number {
    width: 60px;
  }
  span.name {
    width: calc(100% - 60px);
  }
  .control {
    height: 15px;
    width: 15px;
    background-repeat: no-repeat;
    background-size: 100%;
    cursor: pointer;
    opacity: 0;
    transition: .15 opacity all;
    background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDM1Ni45MTkgMzU2LjkxOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzU2LjkxOSAzNTYuOTE4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGcgaWQ9IkxheWVyXzgiPgoJCTxwYXRoIGQ9Ik0zMDEuMjAxLDcuNzIxVjM0OS4xOWMwLDQuMjY5LTMuNDU3LDcuNzI5LTcuNzE1LDcuNzI5aC02My43MDVjLTQuMjY4LDAtNy43MjctMy40Ni03LjcyNy03LjcyOVY3LjcyMSAgICBjMC00LjI2MywzLjQ1OS03LjcyMSw3LjcyNy03LjcyMWg2My43MDVDMjk3Ljc0NCwwLDMwMS4yMDEsMy40NTgsMzAxLjIwMSw3LjcyMXogTTEyNy4xNDIsMEg2My40MzggICAgYy00LjI2NiwwLTcuNzIxLDMuNDU4LTcuNzIxLDcuNzIxVjM0OS4xOWMwLDQuMjY5LDMuNDU1LDcuNzI5LDcuNzIxLDcuNzI5aDYzLjcwM2M0LjI2NSwwLDcuNzIzLTMuNDYsNy43MjMtNy43MjlWNy43MjEgICAgQzEzNC44NjQsMy40NTgsMTMxLjQwNywwLDEyNy4xNDIsMHoiIGZpbGw9IiMxMTZlY2MiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);
    &.paused {
      background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDM3My4wMDggMzczLjAwOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzczLjAwOCAzNzMuMDA4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGcgaWQ9IkxheWVyXzhfMTZfIj4KCQk8cGF0aCBkPSJNNjEuNzkyLDIuNTg4QzY0Ljc3MSwwLjg2NCw2OC4xMDUsMCw3MS40NDQsMGMzLjMzLDAsNi42NjMsMC44NjQsOS42NTUsMi41ODhsMjMwLjExNiwxNjcuMiAgICBjNS45NjMsMy40NDUsOS42NTYsOS44MjMsOS42NTYsMTYuNzE5YzAsNi44OTUtMy42ODMsMTMuMjcyLTkuNjU2LDE2LjcxM0w4MS4wOTksMzcwLjQyN2MtNS45NzIsMy40NDEtMTMuMzM0LDMuNDQxLTE5LjMwMiwwICAgIGMtNS45NzMtMy40NTMtOS42Ni05LjgzMy05LjY2LTE2LjcyNFYxOS4zMDVDNTIuMTM3LDEyLjQxMyw1NS44MTgsNi4wMzYsNjEuNzkyLDIuNTg4eiIgZmlsbD0iIzExNmVjYyIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=);
    }
  }
  .volume {
    height: 15px;
    width: 15px;
    background-repeat: no-repeat;
    background-size: 100%;
    margin-left: 10px;
    background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQ3NS4wODIgNDc1LjA4MSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDc1LjA4MiA0NzUuMDgxOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTIwMC45OTksNjMuOTUyYy00Ljk0NiwwLTkuMjI5LDEuODEyLTEyLjg0Nyw1LjQyNmwtOTUuMDc0LDk1LjA3NUgxOC4yNzZjLTQuOTUyLDAtOS4yMzQsMS44MTItMTIuODUsNS40MjQgICAgQzEuODA5LDE3My40OTMsMCwxNzcuNzc4LDAsMTgyLjcyNnYxMDkuNjNjMCw0Ljk0OSwxLjgwOSw5LjIzMyw1LjQyNiwxMi44NDhjMy42MTksMy42MTcsNy45MDIsNS40MjcsMTIuODUsNS40MjdoNzQuNzk4ICAgIGw5NS4wNzQsOTUuMDc4YzMuNjE3LDMuNjEsNy45LDUuNDI0LDEyLjg0Nyw1LjQyNGM0Ljk1MiwwLDkuMjM0LTEuODEzLDEyLjg1LTUuNDI0YzMuNjE3LTMuNjE0LDUuNDI2LTcuOTAxLDUuNDI2LTEyLjg0N1Y4Mi4yMjggICAgYzAtNC45NDgtMS44MDktOS4yMzQtNS40MjItMTIuODVDMjEwLjIzLDY1Ljc2NCwyMDUuOTUxLDYzLjk1MiwyMDAuOTk5LDYzLjk1MnoiIGZpbGw9IiMxMTZlY2MiLz4KCQk8cGF0aCBkPSJNMzE2Ljc2OSwyNzcuOTM2YzguMDkzLTEyLjQ2NywxMi4xMzUtMjUuOTMsMTIuMTM1LTQwLjM5NXMtNC4wNDItMjcuOTkyLTEyLjEzNS00MC41NTYgICAgYy04LjA5NC0xMi41NjItMTguNzkxLTIxLjQxLTMyLjEyMS0yNi41NTFjLTEuOTAyLTAuOTQ5LTQuMjg0LTEuNDI3LTcuMTM5LTEuNDI3Yy00Ljk0NCwwLTkuMjMyLDEuNzYyLTEyLjg0Nyw1LjI4MiAgICBjLTMuNjEsMy41MjEtNS40MjcsNy44NTItNS40MjcsMTIuOTljMCwzLjk5NywxLjE0Myw3LjM3NiwzLjQzMiwxMC4xMzdjMi4yODMsMi43NjIsNS4wNDEsNS4xNDIsOC4yODIsNy4xMzkgICAgYzMuMjMsMS45OTgsNi40NjgsNC4xODgsOS43MDgsNi41NjdjMy4yMzgsMi4zOCw1Ljk5Niw1Ljc1OCw4LjI3OCwxMC4xMzVjMi4yNzYsNC4zOCwzLjQyNiw5LjgwNCwzLjQyNiwxNi4yNzcgICAgYzAsNi40NzEtMS4xNDMsMTEuODk2LTMuNDI2LDE2LjI3NmMtMi4yODIsNC4zODEtNS4wNCw3Ljc1NS04LjI3OCwxMC4xNGMtMy4yNCwyLjM3OS02LjQ3OCw0LjU2OS05LjcwOCw2LjU2NyAgICBjLTMuMjQxLDEuOTkyLTUuOTk5LDQuMzc3LTguMjgyLDcuMTMyYy0yLjI4MiwyLjc2NS0zLjQzMiw2LjE0My0zLjQzMiwxMC4xNGMwLDUuMTQ0LDEuODE2LDkuNDcsNS40MjcsMTIuOTkgICAgYzMuNjE0LDMuNTIxLDcuOTAyLDUuMjg4LDEyLjg0Nyw1LjI4OGMyLjg1NCwwLDUuMjM2LTAuNDc5LDcuMTM5LTEuNDI0QzI5Ny45NzgsMjk5LjMwNCwzMDguNjc5LDI5MC40MDMsMzE2Ljc2OSwyNzcuOTM2eiIgZmlsbD0iIzExNmVjYyIvPgoJCTxwYXRoIGQ9Ik0zNzcuNzI4LDMxOC4xOTRjMTYuMTgtMjQuNjQ2LDI0LjI3My01MS41MzEsMjQuMjczLTgwLjY1NGMwLTI5LjEyNC04LjA5NC01Ni4wMDUtMjQuMjczLTgwLjY2NiAgICBjLTE2LjE3Ny0yNC42NDUtMzcuNi00Mi41ODMtNjQuMjQxLTUzLjgxNWMtMi40NzEtMC45NS00Ljk0OC0xLjQyNy03LjQxNi0xLjQyN2MtNC45NDgsMC05LjIzNiwxLjgwOS0xMi44NTQsNS40MjYgICAgYy0zLjYxMywzLjYxNi01LjQyNCw3Ljg5OC01LjQyNCwxMi44NDdjMCw3LjQyNCwzLjcxMywxMy4wMzksMTEuMTM5LDE2Ljg0OWMxMC42NTcsNS41MTgsMTcuODg4LDkuNzA1LDIxLjY5MywxMi41NTkgICAgYzE0LjA4OSwxMC4yOCwyNS4wNzcsMjMuMTczLDMyLjk3NiwzOC42ODZjNy44OTgsMTUuNTE0LDExLjg0OCwzMi4wMjYsMTEuODQ4LDQ5LjUzN2MwLDE3LjUxMi0zLjk0OSwzNC4wMjMtMTEuODQ4LDQ5LjUzNiAgICBjLTcuODk4LDE1LjUxNi0xOC44OTQsMjguNDA3LTMyLjk3NiwzOC42ODRjLTMuODA2LDIuODU3LTExLjAzNiw3LjA0My0yMS42OTMsMTIuNTYzYy03LjQyNiwzLjgwOS0xMS4xMzksOS40MjQtMTEuMTM5LDE2Ljg0NyAgICBjMCw0Ljk0OCwxLjgxMSw5LjIzNiw1LjQyNCwxMi44NDdjMy42MTcsMy42MjEsNy45OTEsNS40MzIsMTMuMTMxLDUuNDMyYzIuMjg2LDAsNC42NjgtMC40ODMsNy4xMzktMS40MjggICAgQzM0MC4xMjgsMzYwLjc4MywzNjEuNTUxLDM0Mi44NDQsMzc3LjcyOCwzMTguMTk0eiIgZmlsbD0iIzExNmVjYyIvPgoJCTxwYXRoIGQ9Ik00MzguODI0LDExNi45MmMtMjQuMTcxLTM2LjYzOC01Ni4zNDMtNjMuNjIyLTk2LjUwNS04MC45NDNjLTIuNDcxLTAuOTUtNC45NDgtMS40MjUtNy40MTYtMS40MjUgICAgYy00Ljk0OCwwLTkuMjM2LDEuODExLTEyLjg0Nyw1LjQyNGMtMy42MjEsMy42MTUtNS40MzIsNy45MDItNS40MzIsMTIuODVjMCw2Ljg1MSwzLjcxNCwxMi40NjksMTEuMTQsMTYuODQ2ICAgIGMxLjMzNSwwLjc1NiwzLjQ2NywxLjc1NSw2LjQyLDIuOTk2YzIuOTUsMS4yMzIsNS4wODksMi4yMzEsNi40MjcsMi45OTNjOC43NTQsNC43NTUsMTYuNTYsOS42MTEsMjMuNDE4LDE0LjU2ICAgIGMyMy40MDcsMTcuMzE4LDQxLjY4MiwzOC45MjIsNTQuODE2LDY0LjgwOWMxMy4xMzQsMjUuODg1LDE5LjY5Nyw1My4zODgsMTkuNjk3LDgyLjUxMmMwLDI5LjEyOS02LjU2Myw1Ni42MjYtMTkuNjk3LDgyLjUxMiAgICBjLTEzLjEzMSwyNS44ODktMzEuNDA5LDQ3LjQ5Ni01NC44MTYsNjQuODA5Yy02Ljg1OCw0Ljk0OC0xNC42NjQsOS44MDEtMjMuNDE4LDE0LjU2MmMtMS4zMzgsMC43NTYtMy40NzcsMS43NTItNi40MjcsMi45OSAgICBjLTIuOTUzLDEuMjMyLTUuMDg1LDIuMjMxLTYuNDIsMi45OThjLTcuNDI2LDQuMzc0LTExLjE0LDkuOTkzLTExLjE0LDE2Ljg0NGMwLDQuOTQ5LDEuODExLDkuMjMzLDUuNDMyLDEyLjg0OCAgICBjMy42MSwzLjYxNyw3Ljg5OCw1LjQyNywxMi44NDcsNS40MjdjMi40NjgsMCw0Ljk0NS0wLjQ3Niw3LjQxNi0xLjQzMWM0MC4xNjItMTcuMzE1LDcyLjMzNC00NC4zLDk2LjUwNS04MC45NCAgICBjMjQuMTc0LTM2LjYzOCwzNi4yNTgtNzYuODQ5LDM2LjI1OC0xMjAuNjI1UzQ2My4wMDEsMTUzLjU1NCw0MzguODI0LDExNi45MnoiIGZpbGw9IiMxMTZlY2MiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);
  }
  .more-options {
    height: 15px;
    width: 15px;
    background-repeat: no-repeat;
    background-size: 100%;
    margin-left: 10px;
    opacity: 0;
    cursor: pointer;
    background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQwOCA0MDgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQwOCA0MDg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0ibW9yZS1ob3JpeiI+CgkJPHBhdGggZD0iTTUxLDE1M2MtMjguMDUsMC01MSwyMi45NS01MSw1MXMyMi45NSw1MSw1MSw1MXM1MS0yMi45NSw1MS01MVM3OS4wNSwxNTMsNTEsMTUzeiBNMzU3LDE1M2MtMjguMDUsMC01MSwyMi45NS01MSw1MSAgICBzMjIuOTUsNTEsNTEsNTFzNTEtMjIuOTUsNTEtNTFTMzg1LjA1LDE1MywzNTcsMTUzeiBNMjA0LDE1M2MtMjguMDUsMC01MSwyMi45NS01MSw1MXMyMi45NSw1MSw1MSw1MXM1MS0yMi45NSw1MS01MSAgICBTMjMyLjA1LDE1MywyMDQsMTUzeiIgZmlsbD0iIzZiN2M5MyIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=);
  }
  &:hover {
    .control {
      opacity: 1;
    }
  }
`

class Surahs extends React.Component {
  constructor () {
    super()
    this.state = {
      optionsList: {
        shown: false,
        top: 0,
        left: 0,
        surah: null
      }
    }
    this.toggleMoreOptions = this.toggleMoreOptions.bind(this)
    this.onOutsideClick = this.onOutsideClick.bind(this)
    this.copySurahToClipBoard = this.copySurahToClipBoard.bind(this)
    this.addSurahToQueue = this.addSurahToQueue.bind(this)
  }

  toggleMoreOptions (surah, e) {
    const optionsList = {
      shown: !this.state.optionsList.shown,
      top: e.pageY + 10,
      left: e.pageX - 152,
      surah
    }
    this.setState({ optionsList })
  }

  onOutsideClick (e) {
    if (
      this.state.optionsList.shown &&
      this.options &&
      !this.options.contains(e.target)
    ) {
      this.toggleMoreOptions(null, e)
    }
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.onOutsideClick)
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.onOutsideClick)
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.player) return
    const { location: { search }} = this.props
    const { surah: surahId } = qs.parse(search.substring(1))
    if (!surahId) return
    const { suras } = nextProps
    const surah = R.find(R.propEq('id', surahId))(suras)
    if (!surah) {
      console.log('surah not found.')
      return
    } 
    this.props.onStartTrack({
      surah,
      suras
    })
  }

  addSurahToQueue (e) {
    this.props.handleAddToQueue(this.state.optionsList.surah)
    this.toggleMoreOptions(null, e)
  }

  copySurahToClipBoard (e) {
    const input = document.createElement('input')
    input.setAttribute('id', 'clipboard')
    input.setAttribute('value', this.generateShareUrl(this.state.optionsList.surah.id))
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    this.toggleMoreOptions(null, e)
  }

  generateShareUrl (id) {
    return window.location.origin + window.location.pathname + '?surah=' + id
  }
  
  render () {
    const {
      resumeTrack,
      onPauseStrack,
      player,
      suras,
      currentTrack,
      onStartTrack
    } = this.props
    const { optionsList } = this.state
    if (!suras) return null

    const surahsList = suras.map(x => {
      const active = R.equals(x, currentTrack)
      return (
        <Row active={active} onDoubleClick={() => onStartTrack({surah: x, suras})} key={x.id}>
          <span className='number'>{x.id}</span>
          <span className='name'>{x.name}</span>
          {
            active && (
              <React.Fragment>
                <span 
                  onClick={player.paused ? resumeTrack : onPauseStrack}
                  className={`control ${player.paused && 'paused'}`} />
                <span className='volume' />
              </React.Fragment>
            )
          }
          <span className='more-options' onClick={this.toggleMoreOptions.bind(null, x)} />
        </Row>
      )
    })
    return (
      <StyledBase>
        <Row className='header'>
          <span className='number'>Nº</span>
          <span className='name'>Name</span>
        </Row>
        {surahsList}
        <CSSTransitionGroup
          component='div'
          transitionName='drop'
          transitionEnterTimeout={250}
          transitionLeaveTimeout={200}>
            {
              optionsList.shown && (
                <div
                  onClick={this.onOutsideClick}
                  ref={x => {this.options = x}}
                  className='options-list'
                  style={{left: optionsList.left, top: optionsList.top}}>
                  <span onClick={this.addSurahToQueue}>Add to queue</span>
                  <span onClick={this.copySurahToClipBoard}>Copy link to clipboard</span>
                </div>
              )
            }
          </CSSTransitionGroup>
      </StyledBase>
    )
  }
}

export default withRouter(Surahs)
