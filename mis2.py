from transformers import AutoModelForSequenceClassification, AutoTokenizer
from transformers import pipeline
import nltk
from docx import Document

# Загружаем токенизатор предложений из NLTK
nltk.download('punkt')

# Загружаем предобученную модель и токенизатор для задачи NLI (Natural Language Inference)
model_name = "roberta-large-mnli"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Создаем pipeline для классификации последовательностей
classifier = pipeline("text-classification", model=model, tokenizer=tokenizer, return_all_scores=True)

# Функция для загрузки текста из файла docx
def load_text_from_docx(file_path):
    doc = Document(file_path)
    text = "\n".join([paragraph.text for paragraph in doc.paragraphs if paragraph.text.strip() != ""])
    return text

# Токенизация текста на предложения
def tokenize_text(text):
    sentences = nltk.sent_tokenize(text)
    return sentences

# Пример использования: загрузка текста из файла docx и его токенизация
file_path = "text.docx"  # Замените на путь к вашему файлу .docx
text = load_text_from_docx(file_path)
sentences = tokenize_text(text)

# Определяем противоречия в тексте
def find_contradictions(sentences):
    contradictions = 0
    total_pairs = 0
    for i in range(len(sentences)):
        for j in range(i + 1, len(sentences)):
            premise = sentences[i]
            hypothesis = sentences[j]
            # Прогоняем пару предложений через модель
            result = classifier(f"{premise} {hypothesis}", padding=True, truncation=True)
            
            # result - это список списков, нужно извлечь правильный элемент
            contradiction_score = None
            for item in result[0]:  # Используем result[0], т.к. это список
                if item['label'] == 'CONTRADICTION':
                    contradiction_score = item['score']
                    break
            
            if contradiction_score and contradiction_score > 0.3:  # Используем порог 0.3 для определения противоречия
                contradictions += 1
            total_pairs += 1
            
    return contradictions, total_pairs

# Выполняем анализ противоречий в загруженном тексте
contradictions, total_pairs = find_contradictions(sentences)
percentage = (1 - contradictions / total_pairs) * 100 if total_pairs > 0 else 100

print(f"Текст пригоден на {percentage:.2f}%. Найдено {contradictions} противоречий из {total_pairs} возможных пар.")
