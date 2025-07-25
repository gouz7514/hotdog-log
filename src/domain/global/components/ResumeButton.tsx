import styled from '@emotion/styled'

export function ResumeButton() {
  const handleClick = () => {
    window.open('/resume.pdf', '_blank')
  }

  return <ResumeButtonStyle onClick={handleClick} />
}

const ResumeButtonStyle = styled.div`
  width: 30px;
  height: 30px;
  background-size: 30px 30px;
  background-repeat: no-repeat;
  background-image: url('/images/icon-resume.png');
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`
