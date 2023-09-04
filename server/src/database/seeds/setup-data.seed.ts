import { Connection, getManager } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Option } from '../../modules/quiz/entities/option.entity';
import { Question } from '../../modules/quiz/entities/question.entity';
import { Quiz } from '../../modules/quiz/entities/quiz.entity';
import { quizSampleData } from '../data/quiz.data';

export class SetupData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    console.log('quizSampleData', quizSampleData);
    await getManager().query('ALTER TABLE quizes DISABLE TRIGGER ALL;');
    await getManager().query('ALTER TABLE questions DISABLE TRIGGER ALL;');
    await getManager().query('ALTER TABLE options DISABLE TRIGGER ALL;');
    await getManager().query('TRUNCATE quizes CASCADE');
    await getManager().query('TRUNCATE questions CASCADE');
    await getManager().query('TRUNCATE options CASCADE');
    await getManager().query('ALTER TABLE quizes ENABLE TRIGGER ALL;');
    await getManager().query('ALTER TABLE questions ENABLE TRIGGER ALL;');
    await getManager().query('ALTER TABLE options ENABLE TRIGGER ALL;');

    for (let i = 0; i < quizSampleData.length; i++) {
      const { quizTitle, quizDescription, questions } = quizSampleData[i];

      const quiz = new Quiz();
      quiz.title = quizTitle;
      quiz.description = quizDescription;
      await quiz.save();

      for (let j = 0; j < questions.length; j++) {
        const { question, options } = questions[j];

        const que = new Question();
        que.question = question;
        que.quiz = quiz;
        await que.save();

        for (let k = 0; k < options.length; k++) {
          const { isCorrect, text } = options[k];
          const opt = new Option();
          opt.isCorrect = isCorrect;
          opt.text = text;
          opt.question = que;
          await opt.save();
        }
      }
    }
  }
}
