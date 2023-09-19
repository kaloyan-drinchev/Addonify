import Testimonial from "./Testimonial";
import TestimonialAvatar from "./TestimonialAvatar";
import TestimonialContent from "./TestimonialContent";
import TestimonialText from "./TestimonialText";
import { Box, Container, Heading, VStack, Wrap } from "@chakra-ui/react";
import krasi from "../../assets/krasi.png";
import dana2 from "../../assets/dana2.jpg";
import koko1 from "../../assets/koko1.jpg";

export default function About() {
  return (
    <Box>
      <Container maxW="7xl" py={3} display="flex" flexDir="column" gap={12}>
        <VStack spacing={0} align="center">
          <Heading>Meet Our Team</Heading>
        </VStack>
        <Wrap spacing={5} justify="center">
          <Testimonial>
            <TestimonialContent>
              <TestimonialText>
                Every morning I eat 4 components for breakfast and a glass of
                useEffects.{" "}
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={krasi}
              name="Krasen Filipov"
              title="CTO at Addonify"
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialText>
                Code refactoring is like doing the dishes – it's never done.
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={dana2}
              name="Danaela Zlateva"
              title="CEO at Addonify"
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialText>
                Code is like humor. It's bad when you have to explain it.
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={koko1}
              name="Kaloyan Drinchev"
              title="COO at Addonify"
            />
          </Testimonial>
        </Wrap>
      </Container>
    </Box>
  );
}
