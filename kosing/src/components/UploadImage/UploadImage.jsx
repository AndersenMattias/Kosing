import { Container, Image } from 'react-bootstrap';

import Resizer from 'react-image-file-resizer';

const UploadImage = ({ image, setImage }) => {
  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        // maxWidth
        200,
        // maxHeight
        200,
        // compressFormat
        'PNG',
        // quality:
        75,
        // rotation
        0,
        // responseUriFunc
        (uri) => {
          resolve(uri);
        },
        // outputType
        'base64'
        // minWidth
        // minHeight
      );
    });

  async function handleChange(e) {
    if (e.target.files[0]) {
      // Download image locally
      const file = e.target.files[0];
      // Resize the file to a smaller size
      const image = await resizeFile(file);
    
      setImage(image);
    } else {
    
    }
  }

  return (
    <Container>
      <input type='file' onChange={handleChange} />

      <Image
        style={{ height: '5em', borderRadius: '1em', marginTop: '1em' }}
        src={image}
      />
    </Container>
  );
};

export default UploadImage;
