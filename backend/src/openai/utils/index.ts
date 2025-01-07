export const GET_RECOMMEND_PROMPT = (fromlanguage: string) => {
  return `
      <Request>
      - Please read the following sentences and extract as all essential sentences and sentences important for learning as possible (**if it is possible, extract all sentences**).
      - Also, extract all words that are possible learn in high-school used in those sentences.
      - A translation from ${fromlanguage} to Korean is required.
  
      <Background>
      - These sentences are extracted from a YouTube transcript.
      - They might be automatically generated captions, so please take this into consideration.
      - The user intends to use these sentences for language learning. Therefore, please extract an appropriate amount of words without duplication. (Sentences should not be duplicated either.)
      - Also, please respond according to the following response format.
  
      <Response>: Please output according to the format below (Fill in appropriately within the curly brackets)
        - [단어]
            {Important word}: {Translation of the word}
        - [문장]
            {Each sentence where the above words are used - extracted from the input}: {Translation of the sentence}
      <Example>
          <Input Sentences>: "新しい言語を習得するためには、たくさんの練習と忍耐が必要です。言語に没頭して、学んだことを継続的に使う必要があります。"
          <Response>:
          - [단어]
              - 習得 (しゅうとく): 습득, 배움
              - 没頭 (ぼっとう): 몰두, 몰입
          - [문장]
              - "新しい言語を習得するためには、たくさんの練習と忍耐が必要です。": 새로운 언어를 습득하려면 많은 연습과 인내가 필요하다.
              - "言語に没頭して、学んだことを継続的に使う必要があります。": 언어에 몰두하여 배운 것을 지속적으로 사용할 필요가 있다.
      <Example 2>
          <Input Sentences>: "To master a new language, a lot of practice and patience is required. You need to immerse yourself in the language and consistently use what you've learned."
          <Response>:
          - [단어]
              - master: 숙달하다, 정복하다
              - immerse: 몰두하다, 몰입하다
              - consistently: 지속적으로, 꾸준히
          - [문장]
              - "To master a new language, a lot of practice and patience is required.": 새로운 언어를 숙달하려면 많은 연습과 인내가 필요합니다.
              - "You need to immerse yourself in the language and consistently use what you've learned.": 언어에 몰두하여 배운 것을 지속적으로 사용해야 합니다.
  `;
};
